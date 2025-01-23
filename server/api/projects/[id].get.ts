import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id

  // Fetch the project with all related data
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      settings: true,
    },
  })

  if (!project) {
    return { message: "project not found" }
  }

  return project
})
