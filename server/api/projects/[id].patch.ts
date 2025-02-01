import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Updates a project by its unique identifier, including settings and other fields.
 *
 * @param event H3 event object containing the project ID in the URL parameters and update data in the request body.
 *
 * @returns {Promise<object>} The updated project object.
 *
 * @throws {Error} If the project ID is invalid, the request body is malformed, or there is a database error.
 */
export default defineEventHandler(async (event): Promise<object> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    // Read and validate the request body
    const body = await readBody(event)
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw new Error("Invalid request body: Body must be a non-empty object.")
    }

    const { settingIds, ...rest } = body

    // Fetch the current project settings
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        settings: true,
      },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    // Check if settingIds is provided and different from existing settings
    if (settingIds && Array.isArray(settingIds)) {
      const currentSettingIds = project.settings.map(s => s.id).sort().join(",")
      const newSettingIds = settingIds.sort().join(",")

      if (currentSettingIds !== newSettingIds) {
        // Update project settings
        const updatedProject = await prisma.project.update({
          where: { id },
          data: {
            ...rest,
            settings: {
              set: [], // Disconnect all existing settings
              connect: settingIds.map((settingId: string) => ({ id: settingId })), // Connect new settings
            },
          },
          include: {
            settings: true, // Include the updated settings in the response
          },
        })

        // Fetch all evaluations associated with the project
        const evaluations = await prisma.evaluation.findMany({
          where: { projectId: id },
          select: {
            checkitem: {
              select: {
                testcaseId: true, // Include testcaseId from checkitems
              },
            },
          },
        })

        // Extract unique testcaseIds from checkitems
        const testcaseIds = [...new Set(evaluations.map(e => e.checkitem?.testcaseId))]
        // Regenerate evaluations for each testcaseId
        for (const testcaseId of testcaseIds) {
          if (testcaseId) {
            await regenerateEvaluations(testcaseId, id)
          }
        }

        return updatedProject
      }
    }

    // Update other project information if provided
    const updatedProject = await prisma.project.update({
      where: { id },
      data: rest,
    })

    return updatedProject
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error updating project: ${(error as Error).message}`)

    // Return a generic error response
    throw new Error("An error occurred while updating the project")
  }
})
