import consola from "consola" // Use consola for structured logging
import { defineEventHandler, getQuery } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Checks if a setting name exists in the database.
 *
 * @param event H3 event object containing the setting name in the query parameters.
 *
 * @returns {Promise<string>} A message indicating whether the setting name exists or not.
 *
 * @throws {Error} If there is a database error.
 */
export default defineEventHandler(async (event): Promise<string> => {
  try {
    const query = getQuery(event)

    if (!query.name) {
      consola.warn("Name parameter is missing in the query.")
      return "Please fill name parameter"
    }

    consola.info(`Checking if setting name exists: ${query.name.toString()}`)

    const settingCount = await prisma.setting.count({
      where: { name: { contains: query.name.toString() } },
    })

    if (settingCount > 0) {
      consola.info(`Setting name '${query.name.toString()}' exists in the database.`)
      return "Setting name exists in database, new value will be added"
    }

    consola.info(`Setting name '${query.name.toString()}' does not exist in the database.`)
    return "There are no setting names yet in the database, new name will be added"
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error checking setting name: ${(error as Error).message}`)

    // Return a generic error response
    return "An error occurred while checking the setting name"
  }
})
