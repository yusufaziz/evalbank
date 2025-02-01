import consola from "consola" // Use consola for structured logging
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches a setting by its unique identifier, including related requiring settings.
 *
 * @param event H3 event object containing the setting ID in the URL parameters.
 *
 * @returns {Promise<object | { message: string }>} The setting object if found, or a message indicating it was not found.
 *
 * @throws {Error} If the setting ID is invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<object | { message: string }> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid setting ID: ID must be provided as a string.")
    }

    consola.info(`Attempting to fetch setting with ID: ${id}`)

    // Fetch the setting with all related data
    const setting = await prisma.setting.findUnique({
      where: { id },
      include: {
        requiring: true,
      },
    })

    if (!setting) {
      consola.warn(`Setting not found with ID: ${id}`)
      return { message: "Setting not found" }
    }

    consola.success(`Successfully fetched setting with ID: ${id}`)
    return setting
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching setting: ${(error as Error).message}`)

    // Return a generic error response
    return { message: "An error occurred while fetching the setting" }
  }
})
