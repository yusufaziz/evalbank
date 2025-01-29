import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { projectId, checkitemId, testcaseId, page = 1, pageSize = 10, search } = query as {
    projectId?: string
    checkitemId?: string
    testcaseId?: string
    page?: number
    pageSize?: number
    search?: string
  }

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
    skip: (page - 1) * Number(pageSize),
    take: Number(pageSize),
  })

  // Count total evaluations for pagination
  const allEvaluation = await prisma.evaluation.findMany({
    where: filters,
    select: { judgement: true },
  })

  // Return the response
  return {
    evaluations,
    totalEvaluations: allEvaluation.length,
    evaluationCount: {
      OK: allEvaluation.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.OK).length,
      NG: allEvaluation.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.NG).length,
      NOT_SUPPORT: allEvaluation.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.NOT_SUPPORT).length,
      NOT_EXECUTED: allEvaluation.filter(evaluation => evaluation.judgement === EVALUATION_JUDGEMENT.NOT_EXECUTED).length,
    },
    totalPages: Math.ceil(allEvaluation.length / Number(pageSize)),
    currentPage: page,
  }
})
