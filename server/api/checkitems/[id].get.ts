import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import consola from "consola"
import prisma from "../../../plugins/prisma.client"

/**
 * @function defineEventHandler
 * @brief Defines an HTTP event handler for fetching a specific check item by its ID.
 *
 * @param {object} event - The HTTP event object provided by the server framework.
 *                         It contains the context with route parameters.
 * @returns {Promise<object>} A promise that resolves to either:
 *                            - The requested check item object if found, or
 *                            - A structured response: `{ message: "checkItem not found" }`.
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

    // Fetch the check item from the database
    const checkItem = await prisma.checkitem.findUnique({
      where: { id }, // `id` is already a string, so no parsing is needed
    })

    // Return the check item if found, or a structured "not found" response
    return checkItem || { message: "checkItem not found" }
  }
  catch (error) {
    // Log the error using consola for better logging capabilities
    consola.error("Error fetching check item:", error)

    // Handle specific Prisma errors for granular error responses
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        return { message: "checkItem not found" } // Gracefully handle "record not found"
      }
    }

    // Generic error response for other issues
    throw new Error("Failed to fetch check item")
  }
})
