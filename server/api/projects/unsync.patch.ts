import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Removes evaluations for a specific project and test case.
 *
 * @param event H3 event object containing the project and test case IDs in the request body.
 *
 * @returns {Promise<{ message: string }>} A success message indicating the unsync was completed.
 *
 * @throws {Error} If the project or test case ID is invalid, or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ message: string }> => {
  try {
    const body = await readBody(event)
    const { projectId, testcaseId } = body

    // Validate the input
    if (!projectId || !testcaseId || typeof projectId !== "string" || typeof testcaseId !== "string") {
      throw new Error("Invalid input: Both projectId and testcaseId must be provided as strings.")
    }

    consola.info(`Attempting to unsync evaluations for projectId: ${projectId}, testcaseId: ${testcaseId}`)

    // Fetch the check items associated with the test case
    const checkitems = await prisma.checkitem.findMany({
      where: { testcaseId },
      select: { id: true },
    })

    // Delete evaluations associated with the check items
    await prisma.evaluation.deleteMany({
      where: {
        projectId,
        checkitemId: {
          in: checkitems.map(c => c.id),
        },
      },
    })

    consola.success(`Unsync completed successfully for projectId: ${projectId}, testcaseId: ${testcaseId}`)
    return { message: "Unsync completed successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error unsyncing evaluations: ${(error as Error).message}`)

    // Return a generic error response
    throw createError({
      statusCode: 500,
      statusMessage: "Internal Server Error",
    })
  }
})
