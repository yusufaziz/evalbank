import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const testcases = await prisma.testcase.findMany()
  return testcases
})
