import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  await prisma.testCase.delete({
    where: { id },
  })
  return { message: "testCase deleted successfully" }
})
