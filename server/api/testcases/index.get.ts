import consola from "consola" // Use consola for structured logging
import { defineEventHandler, getQuery } from "h3"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches test cases based on query parameters, optionally filtered by project ID and search criteria.
 *
 * @param event H3 event object containing query parameters for filtering and searching.
 *
 * @returns {Promise<object[]>} An array of test cases, optionally including related check items and attachments.
 *
 * @throws {Error} If there is a database error.
 */
export default defineEventHandler(async (event): Promise<object[]> => {
  try {
    // Step 1: Extract query parameters
    const query = getQuery(event)
    const projectId = query.projectId as string | undefined

    let testcases
    const filters: any = {
      AND: [
        {
          // Exclude test cases linked to the projectId through check items and evaluations
          checkitems: {
            none: {
              evaluations: {
                some: {
                  projectId,
                },
              },
            },
          },
        },
      ],
    }

    if (query.search) {
      filters.AND.push({
        OR: [
          { name: { contains: query.search } },
          { group: { contains: query.search } },
          { procedures: { contains: query.search } },
          { checkitems: { some: { module: { contains: query.search } } } },
          { checkitems: { some: { expectedTarget: { contains: query.search } } } },
          { checkitems: { some: { settings: { some: { name: { contains: query.search } } } } } },
          { checkitems: { some: { settings: { some: { value: { contains: query.search } } } } } },
        ],
      })
    }

    // Step 2: Check if projectId is provided
    if (projectId) {
      // Step 3: Fetch test cases NOT associated with the given projectId
      testcases = await prisma.testcase.findMany({
        where: filters,
        include: {
          checkitems: true, // Include related check items
          attachments: true, // Include related attachments
        },
      })
    }
    else {
      // Step 4: If no projectId is provided, fetch all test cases
      testcases = await prisma.testcase.findMany({
        include: {
          checkitems: {
            include: { settings: true },
          }, // Include related check items
          attachments: true, // Include related attachments
        },
      })
    }

    // Step 5: Return the filtered or unfiltered test cases
    return testcases
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching test cases: ${(error as Error).message}`)

    // Return an empty array in case of error
    return []
  }
})
