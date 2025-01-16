import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const testcase = await prisma.testcase.create({
    data: body,
  })
  return testcase
})
