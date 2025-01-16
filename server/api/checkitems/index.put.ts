import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const checkItem = await prisma.checkitem.create({
    data: body,
  })
  return checkItem
})
