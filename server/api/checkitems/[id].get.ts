import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const checkItem = await prisma.checkitem.findUnique({
    where: { id },
  })
  return checkItem || { message: "checkItem not found" }
})
