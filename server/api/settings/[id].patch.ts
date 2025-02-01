import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Updates a setting by its unique identifier, including requiring settings.
 *
 * @param event H3 event object containing the setting ID in the URL parameters and update data in the request body.
 *
 * @returns {Promise<object>} The updated setting object.
 *
 * @throws {Error} If the setting ID is invalid, the request body is malformed, or there is a database error.
 */
export default defineEventHandler(async (event): Promise<object> => {
  try {
    const id = event.context.params?.id

    // Validate the ID
    if (!id || typeof id !== "string") {
      throw new Error("Invalid setting ID: ID must be provided as a string.")
    }

    // Read and validate the request body
    const body = await readBody(event)
    if (!body || typeof body !== "object" || Object.keys(body).length === 0) {
      throw new Error("Invalid request body: Body must be a non-empty object.")
    }

    const { requiring, ...rest } = body

    const allSetting = requiring.flatMap((require: any) => require.settings || []).map((setting: any) => setting.id)

    consola.info(`Attempting to update setting with ID: ${id}`)

    // Update the setting in the database
    const setting = await prisma.setting.update({
      where: { id },
      data: {
        ...rest,
        requiring: {
          set: [],
          connect: allSetting.map((id: string) => ({ id })),
        },
      },
    })

    consola.success(`Successfully updated setting with ID: ${id}`)
    return setting
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error updating setting: ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2025") {
      throw new Error("Setting not found")
    }

    // Return a generic error response
    throw new Error("An error occurred while updating the setting")
  }
})
