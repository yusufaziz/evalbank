import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (query.distinct === "name") {
    const settings = await prisma.setting.findMany({
      distinct: "name",
      select: { name: true },
    })
    return settings
  }
  const settings = await prisma.setting.findMany()
  return settings
})
