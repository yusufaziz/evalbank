import consola from "consola" // Use consola for structured logging
import { defineEventHandler, readBody } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Creates one or multiple settings based on the request body.
 *
 * @param event H3 event object containing the setting data in the request body.
 *
 * @returns {Promise<object>} The created setting(s).
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

    const { name, value } = body

    if (typeof name !== "string" || !value) {
      throw new Error("Invalid request body: 'name' and 'value' are required.")
    }

    consola.info(`Attempting to create setting(s) with name: ${name}`)

    if (typeof value === "string" && value.includes("\n")) {
      const values = value.split("\n").filter(f => f)

      const settings = await prisma.setting.createMany({
        data: values.map((v: string) => ({ name, value: v })),
      })

      consola.success(`Successfully created multiple settings with name: ${name}`)
      return settings
    }
    else {
      const setting = await prisma.setting.create({
        data: body,
      })

      consola.success(`Successfully created setting with ID: ${setting.id}`)
      return setting
    }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error creating setting(s): ${(error as Error).message}`)

    // Handle specific Prisma errors (optional)
    if ((error as any).code === "P2002") {
      throw new Error("Setting creation failed due to a unique constraint violation.")
    }

    // Return a generic error response
    throw new Error("An error occurred while creating the setting(s)")
  }
})
