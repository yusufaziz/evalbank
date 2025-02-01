import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Synchronizes evaluations for a project and testcase by regenerating them.
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
    const { projectId, testcaseId } = body

    // Validate the input
    if (!projectId || !testcaseId || typeof projectId !== "string" || typeof testcaseId !== "string") {
      throw new Error("Invalid input: Both projectId and testcaseId must be provided as strings.")
    }

    consola.info(`Attempting to sync evaluations for projectId: ${projectId}, testcaseId: ${testcaseId}`)

    // Fetch the project and testcase to ensure they exist
    const project = await prisma.project.findUnique({
      where: { id: projectId },
    })

    if (!project) {
      throw new Error("Project not found")
    }

    const testcase = await prisma.testcase.findUnique({
      where: { id: testcaseId },
    })

    if (!testcase) {
      throw new Error("Testcase not found")
    }

    // Trigger the regenerateEvaluations function
    await regenerateEvaluations(testcaseId, projectId)

    consola.success(`Sync completed successfully for projectId: ${projectId}, testcaseId: ${testcaseId}`)
    return { message: "Sync completed successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error syncing evaluations: ${(error as Error).message}`)

    // Return a generic error response
    throw new Error("An error occurred while syncing evaluations")
  }
})
