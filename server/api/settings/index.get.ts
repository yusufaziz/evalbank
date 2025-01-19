import type { IGroupedSettings } from "~~/shared/interface/settings"
import prisma from "../../../plugins/prisma.client"

export default defineEventHandler(async (event) => {
  const query = getQuery(event)
  if (query.distinct === "name") {
    const settings = await prisma.setting.findMany({
      distinct: "name",
      select: { name: true },
    })
    return settings
  }
  if (query.group === "name") {
    const groupedSettings: IGroupedSettings[] = []
    const settings = await prisma.setting.findMany({
      select: {
        name: true,
        value: true,
      },
    })
    const uniqueName = [...new Set(settings.map(setting => setting.name))]
    uniqueName.forEach((name) => {
      groupedSettings.push({
        name,
        value: [...new Set(settings.filter(f => f.name === name).map(m => m.value))],
      })
    })
    return groupedSettings
  }
  const settings = await prisma.setting.findMany()
  return settings
})
