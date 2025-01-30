import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const setting = await prisma.setting.findUnique({
    where: { id },
    include: {
      requiring: true,
    },
  })
  return setting || { message: "setting not found" }
})
