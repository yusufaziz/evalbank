import consola from "consola" // Use consola for structured logging
import { defineEventHandler, getQuery } from "h3"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../plugins/prisma.client"

/**
 * @brief Fetches paginated evaluations based on filters and search criteria.
 *
 * @param event H3 event object containing query parameters for filtering, pagination, and search.
 *
 * @returns {Promise<{
 *   evaluations: object[],
 *   totalEvaluations: number,
 *   evaluationCount: {
 *     OK: number,
 *     NG: number,
 *     NOT_SUPPORT: number,
 *     NOT_EXECUTED: number,
 *   },
 *   totalPages: number,
 *   currentPage: number,
 * }>} The paginated evaluations and metadata for pagination and counts.
 *
 * @throws {Error} If query parameters are invalid or if there is a database error.
 */
export default defineEventHandler(async (event): Promise<{
  evaluations: object[]
  totalEvaluations: number
  evaluationCount: {
    OK: number
    NG: number
    NOT_SUPPORT: number
    NOT_EXECUTED: number
  }
  totalPages: number
  currentPage: number
}> => {
  try {
    // Extract and validate query parameters
    const query = getQuery(event)
    const {
      projectId,
      checkitemId,
      testcaseId,
      page = "1",
      pageSize = "10",
      search,
    } = query as {
      projectId?: string
      checkitemId?: string
      testcaseId?: string
      page?: string
      pageSize?: string
      search?: string
    }

    // Validate pagination parameters
    const parsedPage = Number.parseInt(page, 10)
    const parsedPageSize = Number.parseInt(pageSize, 10)

    if (Number.isNaN(parsedPage) || parsedPage < 1) {
      throw new Error("Invalid 'page' parameter: Must be a positive integer.")
    }
    if (Number.isNaN(parsedPageSize) || parsedPageSize < 1) {
      throw new Error("Invalid 'pageSize' parameter: Must be a positive integer.")
    }

    consola.info(
      `Fetching evaluations with filters: projectId=${projectId}, checkitemId=${checkitemId}, testcaseId=${testcaseId}, search=${search}, page=${parsedPage}, pageSize=${parsedPageSize}`,
    )

    // Initialize the filters object
    const filters: any = { AND: [] }

    // Add filters for projectId, checkitemId, and testcaseId
    if (projectId)
      filters.AND.push({ projectId })
    if (checkitemId)
      filters.AND.push({ checkitemId })
    if (testcaseId)
      filters.AND.push({ testcaseId })

    // Add search filter
    if (search) {
      filters.AND.push({
        OR: [
          { remarks: { contains: search } },
          { settings: { some: { name: { contains: search } } } },
          { settings: { some: { value: { contains: search } } } },
        ],
      })
    }

    // Fetch paginated evaluations
    const evaluations = await prisma.evaluation.findMany({
      where: filters,
      include: {
        settings: true,
      },
      skip: (parsedPage - 1) * parsedPageSize,
      take: parsedPageSize,
    })

    // Count total evaluations for pagination
    const allEvaluations = await prisma.evaluation.findMany({
      where: filters,
      select: { judgement: true },
    })

    // Calculate evaluation counts by judgement
    const evaluationCount = {
      OK: allEvaluations.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.OK).length,
      NG: allEvaluations.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.NG).length,
      NOT_SUPPORT: allEvaluations.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.NOT_SUPPORT).length,
      NOT_EXECUTED: allEvaluations.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length,
    }

    // Return the response
    return {
      evaluations,
      totalEvaluations: allEvaluations.length,
      evaluationCount,
      totalPages: Math.ceil(allEvaluations.length / parsedPageSize),
      currentPage: parsedPage,
    }
  }
  catch (error) {
    // Log the error using consola
    consola.error(`Error fetching evaluations: ${(error as Error).message}`)

    // Return a generic error response
    return {
      evaluations: [],
      totalEvaluations: 0,
      evaluationCount: {
        OK: 0,
        NG: 0,
        NOT_SUPPORT: 0,
        NOT_EXECUTED: 0,
      },
      totalPages: 0,
      currentPage: 0,
    }
  }
})
