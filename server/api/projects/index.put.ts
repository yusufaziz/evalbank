import consola from "consola"
import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  consola.log(body)
  const project = await prisma.project.create({
    data: body,
  })
  return project
})
