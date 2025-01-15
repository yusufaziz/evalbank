import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const setting = await prisma.setting.create({
    data: body,
  })
  return setting
})
