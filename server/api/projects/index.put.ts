import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Creates a new project.
 *
 * @param event H3 event object containing the project data in the request body.
 *
 * @returns {Promise<object>} The newly created project object.
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

    const { settingIds, ...rest } = body

    consola.info("Attempting to create a new project")

    // Create the project in the database
    const project = await prisma.project.create({
      data: {
        ...rest,
        settings: {
          connect: settingIds.map((settingId: string) => ({ id: settingId })), // Connect new settings
        },
      },
    })

    consola.success(`Successfully created project with ID: ${project.id}`)
    return project
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error creating project: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2002") {
      throw new Error("Project creation failed due to a unique constraint violation.")
    }

    // Return a generic error response
    throw new Error("An error occurred while creating the project")
  }
})
