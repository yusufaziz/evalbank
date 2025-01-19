import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  if (!id) {
    throw new Error("ID is required")
  }

  const { settingIds, ...rest } = body

  const project = await prisma.project.update({
    where: { id },
    data: {
      ...rest,
      settings: {
        set: [], // Disconnect all existing settings
        connect: settingIds.map((settingId: string) => ({ id: settingId })), // Connect new settings
      },
    },
    include: {
      settings: true, // Include the updated settings in the response
    },
  })

  return project
})
