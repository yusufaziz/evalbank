import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const { projectId, checkitemId, testcaseId, page = 1, pageSize = 10 } = query as { projectId?: string, checkitemId?: string, testcaseId?: string, page?: number, pageSize?: number }

  const filters: any = {}
  if (projectId)
    filters.projectId = projectId
  if (checkitemId)
    filters.checkitemId = checkitemId
  if (testcaseId)
    filters.testcaseId = testcaseId

  const evaluations = await prisma.evaluation.findMany({
    where: filters,
    include: {
      settings: true,
    },
    skip: (page - 1) * Number(pageSize),
    take: Number.parseInt(pageSize.toString(), 10),
  })

  const totalEvaluations = await prisma.evaluation.count({
    where: filters,
  })

  return {
    evaluations,
    totalEvaluations,
    totalPages: Math.ceil(totalEvaluations / pageSize),
    currentPage: page,
  }
})
