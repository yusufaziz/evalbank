import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Deletes a setting by its unique identifier.
 *
 * @param event H3 event object containing the setting ID in the URL parameters.
 *
 * @returns {Promise<{ message: string }>} A success message indicating the setting was deleted.
 *
 * @throws {Error} If the setting ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{ message: string }> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid setting ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to delete setting with ID: ${id}`)

    // Delete the setting from the database
    await prisma.setting.delete({
      where: { id },
    })

    consola.success(`Successfully deleted setting with ID: ${id}`)
    return { message: "Setting deleted successfully" }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error deleting setting: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      throw new Error("Setting not found")
    }

    // Return a generic error response
    throw new Error("An error occurred while deleting the setting")
  }
})
