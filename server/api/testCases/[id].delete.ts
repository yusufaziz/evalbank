import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  await prisma.testcase.delete({
    where: { id },
  })
  return { message: "testcase deleted successfully" }
})
