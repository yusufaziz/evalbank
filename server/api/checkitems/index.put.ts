import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import consola from "consola"
import { readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @function defineEventHandler
 * @brief Defines an HTTP event handler for creating a new check item.
 *
 * @param {object} event - The HTTP event object provided by the server framework.
 *                         It contains the request body with data for the new check item.
 * @returns {Promise<object>} A promise that resolves to the newly created check item object.
 *
 * @throws {Error} If the request body is invalid or if there is an issue with the database query,
 *                 an error will be thrown with a descriptive message.
 */
export default defineEventHandler(async (event) => {
  try {
    // Read and validate the request body
    const body = await readBody(event)
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw new Error("Invalid request body. Expected a non-empty object.")
    }

    // Create the check item in the database
    const checkItem = await prisma.checkitem.create({
      data: body, // Use the validated request body for creation
    })

    // Return the newly created check item
    return checkItem
  }
  catch (error) {
    // Log the error using consola for better logging capabilities
    consola.error("Error creating check item:", error)

    // Handle specific Prisma errors for granular error responses
    if (error instanceof PrismaClientKnownRequestError) {
      if (error.code === "P2002") {
        throw new Error("A unique constraint was violated. Please check your input data.")
      }
      if (error.code === "P2000") {
        throw new Error("One or more fields exceed the maximum length allowed.")
      }
    }

    // Generic error response for other issues
    throw new Error("Failed to create check item")
  }
})
