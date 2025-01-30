import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const { name, value } = body
  if (value.includes("\n")) {
    const values = value.split("\n")
    const settings = await prisma.setting.createMany({
      data: values.map((v: string) => {
        return { name, value: v }
      },
      ),
    })
    return settings
  }
  else {
    const setting = await prisma.setting.create({
      data: body,
    })
    return setting
  }
})
