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
    const { checkitems, ...testcaseData } = body

    // Use a transaction to ensure atomicity
    const result = await prisma.$transaction(async (prisma) => {
      // Create the Test Case
      const testcase = await prisma.testcase.create({
        data: testcaseData,
      })

      // Log the created Test Case for debugging
      consola.success("Created Test Case:", testcase)

      // Filter out Check Items with id: "-" and create them in the database
      if (checkitems && Array.isArray(checkitems)) {
        const newCheckitems = checkitems.filter(item => item.id === "-" || !item.id)

        // Log the new Check Items for debugging
        consola.info("New Check Items to Create:", newCheckitems)

        for (const item of newCheckitems) {
          try {
            // Create the Check Item and connect the settings
            const createdCheckitem = await prisma.checkitem.create({
              data: {
                module: item.module,
                expectedTarget: item.expectedTarget,
                testcaseId: testcase.id, // Associate with the newly created Test Case
                settings: {
                  connect: item.settings.map(setting => ({ id: setting.id })), // Connect the settings
                },
              },
            })

            // Log the created Check Item for debugging
            consola.success("Created Check Item:", createdCheckitem)
          }
          catch (error) {
            consola.error("Failed to create Check Item:", error)
            throw error
          }
        }
      }

      return testcase
    })

    return result
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
