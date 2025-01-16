import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const testcase = await prisma.testcase.findUnique({
    where: { id },
  })
  return testcase || { message: "testcase not found" }
})
