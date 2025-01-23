import consola from "consola"
import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  consola.log(body)
  const { settingIds, ...rest } = body
  const project = await prisma.project.create({
    data: {
      ...rest,
      settings: {
        connect: settingIds.map((settingId: string) => ({ id: settingId })), // Connect new settings
      },
    },
  })
  return project
})
