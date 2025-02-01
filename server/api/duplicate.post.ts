import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../plugins/prisma.client"

/**
 * @brief Handles the duplication of projects or testcases based on the provided type and ID.
 *
 * @param event H3 event object containing the request body.
 *
 * @returns {Promise<{ success: boolean, data?: object, error?: string }>} The newly created project or testcase.
 *
 * @throws {Error} If the input data is invalid, the resource is not found, or there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ success: boolean, data?: object, error?: string }> => {
  try {
    // Read and validate the request body
    const body = await readBody(event)

    /**
     * @typedef {object} RequestBody
     * @property {string} type - The type of resource to duplicate ("projects" or "testcases").
     * @property {string} id - The unique identifier of the resource to duplicate.
     */
    if (!body || typeof body.type !== "string" || typeof body.id !== "string") {
      throw new Error("Invalid input: 'type' and 'id' must be provided as strings.")
    }

    const { type, id }: { type: string, id: string } = body

    consola.info(`Received request to duplicate ${type} with ID: ${id}`)

    // Handle duplication based on the type
    if (type === "projects") {
      const newProject = await duplicateProject(id)
      return { success: true, data: newProject }
    }
    else if (type === "testcases") {
      const newTestcase = await duplicateTestcase(id)
      return { success: true, data: newTestcase }
    }
    else {
      throw new Error("Invalid type: Only 'projects' and 'testcases' are supported.")
    }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error processing duplication request: ${(error as Error).message}`)
    return { success: false, error: (error as Error).message }
  }
})

/**
 * @brief Duplicates a project by copying its details and related entities.
 *
 * @param projectId The unique identifier of the project to duplicate.
 *
 * @returns {Promise<object>} The newly created project.
 *
 * @throws {Error} If the project is not found or there is a database error.
 */
async function duplicateProject(projectId: string): Promise<object> {
  consola.info(`Attempting to duplicate project with ID: ${projectId}`)

  // Fetch the original project with related entities
  const project = await prisma.project.findUnique({
    where: { id: projectId },
    include: {
      settings: true,
      evaluations: {
        include: {
          testcase: {
            select: { id: true },
          },
        },
      },
      attachments: true,
    },
  })

  if (!project) {
    throw new Error("Project not found")
  }

  // Create a new project with copied details
  const newProject = await prisma.project.create({
    data: {
      name: `${project.name} (Copy)`,
      modelFY: project.modelFY,
      modelSeries: project.modelSeries,
      modelName: project.modelName,
      settings: {
        connect: project.settings.map(setting => ({ id: setting.id })),
      },
      attachments: {
        connect: project.attachments.map(attachment => ({ id: attachment.id })),
      },
    },
  })

  // Regenerate evaluations for the new project
  const testcaseIds = [...new Set(project.evaluations.map(evaluation => evaluation.testcase?.id))]
  testcaseIds.forEach(testcaseId => regenerateEvaluations(testcaseId || "", newProject.id))

  consola.success(`Successfully duplicated project with ID: ${newProject.id}`)
  return newProject
}

/**
 * @brief Duplicates a testcase by copying its details and related entities.
 *
 * @param testcaseId The unique identifier of the testcase to duplicate.
 *
 * @returns {Promise<object>} The newly created testcase.
 *
 * @throws {Error} If the testcase is not found or there is a database error.
 */
async function duplicateTestcase(testcaseId: string): Promise<object> {
  consola.info(`Attempting to duplicate testcase with ID: ${testcaseId}`)

  // Fetch the original testcase with related entities
  const testcase = await prisma.testcase.findUnique({
    where: { id: testcaseId },
    include: {
      checkitems: {
        include: {
          settings: true, // Include settings for checkitems
        },
      },
      attachments: true,
    },
  })

  if (!testcase) {
    throw new Error("Testcase not found")
  }

  // Create a new testcase with copied details
  const newTestcase = await prisma.testcase.create({
    data: {
      name: `${testcase.name} (Copy)`,
      procedures: testcase.procedures,
      attachments: {
        connect: testcase.attachments.map(attachment => ({ id: attachment.id })),
      },
    },
  })

  // Duplicate checkitems for the new testcase
  await prisma.$transaction(
    testcase.checkitems.map(checkitem =>
      prisma.checkitem.create({
        data: {
          module: checkitem.module,
          expectedTarget: checkitem.expectedTarget,
          testcaseId: newTestcase.id,
          settings: {
            connect: checkitem.settings.map(setting => ({ id: setting.id })),
          },
        },
      }),
    ),
  )

  consola.success(`Successfully duplicated testcase with ID: ${newTestcase.id}`)
  return newTestcase
}
