import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches a test case by its unique identifier, including related check items and settings.
 *
 * @param event H3 event object containing the test case ID in the URL parameters.
 *
 * @returns {Promise<object | { message: string }>} The test case object if found, or a message indicating it was not found.
 *
 * @throws {Error} If the test case ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid test case ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to fetch test case with ID: ${id}`)

    // Fetch the test case with all related data
    const testcase = await prisma.testcase.findUnique({
      where: { id },
      select: {
        id: true,
        group: true,
        name: true,
        procedures: true,
        checkitems: {
          select: {
            id: true,
            module: true,
            expectedTarget: true,
            settings: {
              select: { id: true, name: true, value: true },
            },
          },
        },
      },
    })

    if (!testcase) {
      consola.warn(`Test case not found with ID: ${id}`)
      return { message: "Test case not found" }
    }

    consola.success(`Successfully fetched test case with ID: ${id}`)
    return testcase
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching test case: ${(error as Error).message}`)

    // Return a generic error response
    return { message: "An error occurred while fetching the test case" }
  }
})
