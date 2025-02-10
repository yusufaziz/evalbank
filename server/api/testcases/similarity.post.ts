import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Creates a new test case, including related check items and settings.
 *
 * @param event H3 event object containing the test case data in the request body.
 *
 * @returns {Promise<object>} The newly created test case object.
 *
 * @throws {Error} If the request body is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object> => {
  try {
    // Read and validate the request body
    const body = await readBody(event)
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw new Error("Invalid request body: Body must be a non-empty object.")
    }

    // Log the incoming payload for debugging
    consola.info("Incoming Payload:", JSON.stringify(body, null, 2))

    // Destructure the payload
    const { procedures } = body

    if (procedures.length > 3) {
      const testcases = await prisma.testcase.findMany({
        select: { id: true, procedures: true },
      })
      return getTop5SimilarParagraphs(procedures, testcases)
    }
    else {
      return { message: "empty procedures" }
    }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error creating test case: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2002") {
      throw new Error("Test case creation failed due to a unique constraint violation.")
    }

    // Return a generic error response
    throw new Error("An error occurred while creating the test case")
  }
})
