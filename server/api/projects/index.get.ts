import consola from "consola" // Use consola for structured logging
import { defineEventHandler, getQuery } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches a list of projects, optionally limited by a query parameter.
 *
 * @param event H3 event object containing query parameters for limiting results.
 *
 * @returns {Promise<object[]>} An array of projects sorted by updatedAt in descending order.
 *
 * @throws {Error} If there is a database error.
 */
export default defineEventHandler(async (event): Promise<object[]> => {
  try {
    const query = getQuery(event)
    const limit = query.limit ? Number.parseInt(query.limit.toString(), 10) : undefined

    if (limit && (Number.isNaN(limit) || limit < 1)) {
      throw new Error("Invalid 'limit' parameter: Must be a positive integer.")
    }

    consola.info(`Fetching projects with limit: ${limit}`)

    const projects = await prisma.project.findMany({
      take: limit,
      orderBy: {
        updatedAt: "desc",
      },
    })

    return projects
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching projects: ${(error as Error).message}`)

    // Return an empty array in case of error
    return []
  }
})
