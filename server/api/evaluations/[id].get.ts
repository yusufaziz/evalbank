import consola from "consola" // Use consola for structured logging
import { defineEventHandler } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches an evaluation by its unique identifier.
 *
 * @param event H3 event object containing the evaluation ID in the URL parameters.
 *
 * @returns {Promise<object | { message: string }>} The evaluation object if found, or a message indicating it was not found.
 *
 * @throws {Error} If the evaluation ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    // Extract the evaluation ID from the URL parameters
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid evaluation ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to fetch evaluation with ID: ${id}`)

    // Fetch the evaluation from the database
    const evaluation = await prisma.evaluation.findUnique({
      where: { id },
    })

    if (!evaluation) {
      consola.warn(`Evaluation not found with ID: ${id}`)
      return { message: "Evaluation not found" }
    }

    consola.success(`Successfully fetched evaluation with ID: ${id}`)
    return evaluation
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching evaluation: ${(error as Error).message}`)

    // Return a generic error response
    return { message: "An error occurred while fetching the evaluation" }
  }
})
