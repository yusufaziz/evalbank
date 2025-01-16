import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)
  const testcase = await prisma.testcase.update({
    where: { id },
    data: body,
  })
  return testcase
})
