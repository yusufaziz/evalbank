import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../../plugins/prisma.client"

/**
 * @brief Synchronizes settings for a project.
 *
 * @param event H3 event object containing the project and testcase IDs in the request body.
 *
 * @returns {Promise<{ message: string }>} A success message indicating the sync was completed.
 *
 * @throws {Error} If the project or testcase ID is invalid, or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ message: string }> => {
  try {
    const body = await readBody(event)
    const { projectId, settingIds } = body

    // Validate the input
    if (!projectId || !settingIds || typeof projectId !== "string") {
      throw new Error("Invalid input: Both projectId, settingIds must be provided as strings.")
    }

    consola.info(`Attempting to sync settings for projectId: ${projectId}, settingIds: ${settingIds}`)

    // Fetch the project and testcase to ensure they exist
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    /** TODO: Sync settings */
    await prisma.project.update({
      where: { id: projectId },
      data: {
        settings: {
          set: [], // Disconnect all existing settings
          connect: JSON.parse(settingIds).map((settingId: string) => ({ id: settingId })), // Connect new settings
        },
      },
    })

    // Fetch all evaluations associated with the project
    const evaluations = await prisma.evaluation.findMany({
      where: { projectId },
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
        await regenerateEvaluations(testcaseId, projectId)
      }
    }

    return { message: "Sync completed successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error syncing evaluations: ${(error as Error).message}`)

    // Return a generic error response
    throw new Error("An error occurred while syncing evaluations")
  }
})
