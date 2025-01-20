import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const project = await prisma.project.findUnique({
    where: { id },
    include: {
      settings: true,
      attachments: true,
      evaluations: {
        include: {
          settings: true,
          checkitem: {
            include: {
              testcase: true,
            },
          },
        },
      },
    },
  })
  return project || { message: "project not found" }
})
