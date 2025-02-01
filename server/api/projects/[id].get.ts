import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches a project by its unique identifier, including related settings and attachments.
 *
 * @param event H3 event object containing the project ID in the URL parameters.
 *
 * @returns {Promise<object | { message: string }>} The project object if found, or a message indicating it was not found.
 *
 * @throws {Error} If the project ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    // Extract the project ID from the URL parameters
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid project ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to fetch project with ID: ${id}`)

    // Fetch the project with all related data
    const project = await prisma.project.findUnique({
      where: { id },
      include: {
        settings: true,
        attachments: true,
      },
    })

    if (!project) {
      consola.warn(`Project not found with ID: ${id}`)
      return { message: "Project not found" }
    }

    consola.success(`Successfully fetched project with ID: ${id}`)
    return project
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching project: ${(error as Error).message}`)

    // Return a generic error response
    return { message: "An error occurred while fetching the project" }
  }
})
