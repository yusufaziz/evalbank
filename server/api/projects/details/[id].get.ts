import consola from "consola" // Use consola for structured logging
import prisma from "../../../../plugins/prisma.client"

/**
 * @brief Fetches detailed information about a project, including evaluations grouped by test cases and check items.
 *
 * @param event H3 event object containing the project ID in the URL parameters.
 *
 * @returns {Promise<object | { message: string }>} The project details if found, or a message indicating it was not found.
 *
 * @throws {Error} If the project ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to fetch project details with ID: ${id}`)

    // Fetch the project with all related data
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        settings: { select: { id: true, name: true, value: true } },
        attachments: true,
        evaluations: {
          select: {
            id: true,
            judgement: true,
            settings: { select: { id: true, name: true, value: true } },
            checkitem: {
              select: {
                id: true,
                module: true,
                expectedTarget: true,
                settings: true,
                testcase: { select: { id: true, name: true, procedures: true } },
              },
            },
          },
        },
      },
    })

    if (!project) {
      consola.warn(`Project not found with ID: ${id}`)
      return { message: "Project not found" }
    }

    // Group evaluations by testcase and checkitem
    const testcasesMap = new Map<string, any>()
    project.evaluations.forEach((evaluation) => {
      const testcaseId = evaluation.checkitem?.testcase?.id
      const checkitemId = evaluation.checkitem?.id

      if (!testcaseId || !checkitemId) {
        return
      }

      // Initialize testcase if not already in the map
      if (!testcasesMap.has(testcaseId)) {
        testcasesMap.set(testcaseId, {
          ...evaluation.checkitem?.testcase,
          checkitems: new Map<string, any>(),
        })
      }

      const testcase = testcasesMap.get(testcaseId)

      // Initialize checkitem if not already in the testcase
      if (!testcase.checkitems.has(checkitemId)) {
        const { testcase: _testcase, ...restCheckitem } = evaluation.checkitem
        testcase.checkitems.set(checkitemId, {
          ...restCheckitem,
          evaluations: [],
        })
      }

      const checkitem = testcase.checkitems.get(checkitemId)

      // Add evaluation to the checkitem
      const { checkitem: _checkitem, ...restEvaluation } = evaluation
      checkitem.evaluations.push({
        ...restEvaluation,
        settings: evaluation.settings,
      })
    })

    // Convert the map to the desired structure
    const testcases = Array.from(testcasesMap.values()).map(testcase => ({
      ...testcase,
      checkitems: Array.from(testcase.checkitems.values()),
    }))

    const { evaluations, ...rest } = project

    // Return the project with the reshaped data
    return {
      ...rest,
      testcases,
    }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching project details: ${(error as Error).message}`)

    // Return a generic error response
    return { message: "An error occurred while fetching the project details" }
  }
})
