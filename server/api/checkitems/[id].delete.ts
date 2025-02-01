import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import consola from "consola"
import prisma from "../../../plugins/prisma.client"

/**
 * @function defineEventHandler
 * @brief Defines an HTTP event handler for deleting a specific check item by its ID.
 *
 * @param {object} event - The HTTP event object provided by the server framework.
 *                         It contains the context with route parameters.
 * @returns {Promise<object>} A promise that resolves to an object with a success message:
 *                            `{ message: "checkItem deleted successfully" }`.
 *
 * @throws {Error} If the `id` is missing, invalid, or if there is an issue with the database query,
 *                 an error will be thrown with a descriptive message.
 */
export default defineEventHandler(async (event) => {
  try {
    // Extract the `id` parameter from the route context
    const id = event.context.params?.id

    // Validate and sanitize the `id` parameter to ensure it matches the `nanoid` format
    if (!id || !/^[\w-]{21}$/.test(id)) {
      throw new Error("Invalid 'id' parameter. Expected a valid nanoid string.")
    }

    // Delete the check item from the database
    await prisma.checkitem.delete({
      where: { id }, // `id` is already a string, so no parsing is needed
    })

    // Return a success message
    return { message: "checkItem deleted successfully" }
  }
  catch (error) {
    // Log the error using consola for better logging capabilities
    consola.error("Error deleting check item:", error)

    // Handle specific Prisma errors for granular error responses
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("No checkItem found with the provided ID.")
      }
    }

    // Generic error response for other issues
    throw new Error("Failed to delete check item")
  }
})
