import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Deletes a test case and its related data by its unique identifier.
 *
 * @param event H3 event object containing the test case ID in the URL parameters.
 *
 * @returns {Promise<{ message: string }>} A success message indicating the test case was deleted.
 *
 * @throws {Error} If the test case ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ message: string }> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid test case ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to delete test case with ID: ${id}`)

    // Delete related check items
    await prisma.checkitem.deleteMany({
      where: { testcaseId: id },
    })

    // Delete related attachments
    await prisma.attachment.deleteMany({
      where: { testcases: { some: { id } } },
    })

    // Delete the test case itself
    await prisma.testcase.delete({
      where: { id },
    })

    consola.success(`Successfully deleted test case with ID: ${id}`)
    return { message: "Test case and related data deleted successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error deleting test case: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      throw new Error("Test case not found")
    }

    // Return a generic error response
    throw new Error("An error occurred while deleting the test case")
  }
})
