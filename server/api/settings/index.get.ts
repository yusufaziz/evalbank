import type { IGroupedSettings } from "~~/shared/interface/setting"
import consola from "consola" // Use consola for structured logging
import { defineEventHandler, getQuery } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches settings based on query parameters for distinct or grouped data.
 *
 * @param event H3 event object containing query parameters for filtering and grouping.
 *
 * @returns {Promise<object[]>} An array of settings based on the query parameters.
 *
 * @throws {Error} If there is a database error.
 */
export default defineEventHandler(async (event): Promise<object[]> => {
  try {
    const query = getQuery(event)

    if (query.distinct === "name") {
      consola.info("Fetching distinct setting names")

      const settings = await prisma.setting.findMany({
        distinct: "name",
        select: { name: true },
      })

      return settings
    }

    if (query.group === "name") {
      consola.info("Fetching grouped settings by name")

      const groupedSettings: IGroupedSettings[] = []
      const settings = await prisma.setting.findMany({
        select: {
          id: true,
          name: true,
          value: true,
        },
      })

      const uniqueName = [...new Set(settings.map(setting => setting.name))]
      uniqueName.forEach((name) => {
        groupedSettings.push({
          name,
          value: [
            ...new Set(
              settings
                .filter(f => f.name === name)
                .map(m => `${query.with === "id" ? `${m.id}#` : ""}${m.value}`),
            ),
          ],
        })
      })

      return groupedSettings
    }

    consola.info("Fetching all settings ordered by name")

    const settings = await prisma.setting.findMany({
      orderBy: { name: "asc" },
    })

    return settings
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching settings: ${(error as Error).message}`)

    // Return an empty array in case of error
    return []
  }
})
