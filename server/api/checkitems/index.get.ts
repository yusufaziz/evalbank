import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const checkitems = await prisma.checkitem.findMany()
  return checkitems
})
