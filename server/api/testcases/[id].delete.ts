import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  if (!id) {
    throw new Error("ID is required")
  }

  await prisma.checkitem.deleteMany({
    where: { testcaseId: id },
  })

  await prisma.attachment.deleteMany({
    where: { testcases: { some: { id } } },
  })

  await prisma.testcase.delete({
    where: { id },
  })

  return { message: "Testcase and related data deleted successfully" }
})
