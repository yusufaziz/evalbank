import consola from "consola" // Use consola for structured logging
import { defineEventHandler } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Deletes an evaluation by its unique identifier.
 *
 * @param event H3 event object containing the evaluation ID in the URL parameters.
 *
 * @returns {Promise<{ message: string }>} A success message indicating the evaluation was deleted.
 *
 * @throws {Error} If the evaluation ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ message: string }> => {
  try {
    // Extract the evaluation ID from the URL parameters
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid evaluation ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to delete evaluation with ID: ${id}`)

    // Delete the evaluation from the database
    await prisma.evaluation.delete({
      where: { id },
    })

    consola.success(`Successfully deleted evaluation with ID: ${id}`)
    return { message: "Evaluation deleted successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error deleting evaluation: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      // Prisma error code for "Record not found"
      return { message: "Evaluation not found" }
    }

    // Return a generic error response
    return { message: "An error occurred while deleting the evaluation" }
  }
})
