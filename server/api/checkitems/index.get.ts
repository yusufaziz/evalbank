import { PrismaClientKnownRequestError } from "@prisma/client/runtime/library"
import consola from "consola"
import prisma from "../../../plugins/prisma.client"

/**
 * @function defineEventHandler
 * @brief Defines an HTTP event handler for fetching all check items.
 *
 * @param {object} event - The HTTP event object provided by the server framework.
 * @returns {Promise<Array>} A promise that resolves to an array of check items.
 *
 * @throws {Error} If there is an issue with the database query,
 *                 an error will be thrown with a descriptive message.
 */
export default defineEventHandler(async (_event) => {
  try {
    // Fetch all check items from the database
    const checkItems = await prisma.checkitem.findMany()

    // Return the fetched check items
    return checkItems
  }
  catch (error) {
    // Log the error using consola for better logging capabilities
    consola.error("Error fetching check items:", error)

    // Handle specific Prisma errors for granular error responses
    if (error instanceof PrismaClientKnownRequestError) {
      throw new TypeError("Database error occurred while fetching check items.")
    }

    // Generic error response for other issues
    throw new Error("Failed to fetch check items")
  }
})
