import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Deletes a project and all associated evaluations by its unique identifier.
 *
 * @param event H3 event object containing the project ID in the URL parameters.
 *
 * @returns {Promise<{ message: string }>} A success message indicating the project was deleted.
 *
 * @throws {Error} If the project ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ message: string }> => {
  try {
    // Extract the project ID from the URL parameters
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to delete project with ID: ${id}`)

    // Delete all evaluations associated with the project
    await prisma.evaluation.deleteMany({
      where: { projectId: id },
    })

    // Delete the project itself
    await prisma.project.delete({
      where: { id },
    })

    consola.success(`Successfully deleted project with ID: ${id}`)
    return { message: "Project deleted successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error deleting project: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      // Prisma error code for "Record not found"
      return { message: "Project not found" }
    }

    // Return a generic error response
    return { message: "An error occurred while deleting the project" }
  }
})
