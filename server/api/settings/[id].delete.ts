import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  await prisma.setting.delete({
    where: { id },
  })
  return { message: "setting deleted successfully" }
})
