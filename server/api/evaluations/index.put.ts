import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Creates a new evaluation.
 *
 * @param event H3 event object containing the evaluation data in the request body.
 *
 * @returns {Promise<object | { message: string }>} The newly created evaluation object if successful, or a message indicating failure.
 *
 * @throws {Error} If the request body is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    // Read and validate the request body
    const body = await readBody(event)
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw new Error("Invalid request body: Body must be a non-empty object.")
    }

    consola.info(`Attempting to create a new evaluation`)

    // Create the evaluation in the database
    const evaluation = await prisma.evaluation.create({
      data: body,
    })

    consola.success(`Successfully created evaluation with ID: ${evaluation.id}`)
    return evaluation
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error creating evaluation: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2002") {
      // Prisma error code for "Unique constraint violation"
      return { message: "Evaluation creation failed due to a unique constraint violation." }
    }

    // Return a generic error response
    return { message: "An error occurred while creating the evaluation" }
  }
})
