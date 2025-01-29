import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const testcase = await prisma.testcase.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      procedures: true,
      checkitems: {
        select: {
          id: true,
          module: true,
          expectedTarget: true,
          settings: {
            select: { id: true, name: true, value: true },
          },
        },
      },
    },
  })
  return testcase || { message: "testcase not found" }
})
