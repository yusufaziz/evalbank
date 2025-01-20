import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  const projects = await prisma.project.findMany({
    take: (query.limit ? Number.parseInt(query.limit.toString()) : undefined),
    orderBy: {
      updatedAt: "desc",
    },
  })
  return projects
})
