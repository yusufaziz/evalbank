import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  await prisma.evaluation.deleteMany({
    where: { projectId: id },
  })

  await prisma.project.delete({
    where: { id },
  })

  return { message: "project deleted successfully" }
})
