import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const id = event.context.params?.id
  const body = await readBody(event)

  const { requiring, ...rest } = body
  const allSetting = requiring.flatMap((require: any) => require.settings || []).map((setting: any) => setting.id)
  const setting = await prisma.setting.update({
    where: { id },
    data: {
      ...rest,
      requiring: {
        set: [],
        connect: allSetting.map((id: any) => ({ id })),
      },
    },
  })

  return setting
})
