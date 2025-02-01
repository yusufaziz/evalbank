import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import consola from "consola"
import { readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @function defineEventHandler
 * @brief Defines an HTTP event handler for updating a specific check item by its ID.
 *
 * @param {object} event - The HTTP event object provided by the server framework.
 *                         It contains the context with route parameters and the request body.
 * @returns {Promise<object>} A promise that resolves to the updated check item object.
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

    // Read and validate the request body
    const body = await readBody(event)
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw new Error("Invalid request body. Expected a non-empty object.")
    }

    // Update the check item in the database
    const checkItem = await prisma.checkitem.update({
      where: { id }, // `id` is already a string, so no parsing is needed
      data: body, // Use the validated request body for the update
    })

    // Return the updated check item
    return checkItem
  }
  catch (error) {
    // Log the error using consola for better logging capabilities
    consola.error("Error updating check item:", error)

    // Handle specific Prisma errors for granular error responses
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2025") {
        throw new Error("No checkItem found with the provided ID.")
      }
      if (error.code === "P2000") {
        throw new Error("One or more fields exceed the maximum length allowed.")
      }
    }

    // Generic error response for other issues
    throw new Error("Failed to update check item")
  }
})
