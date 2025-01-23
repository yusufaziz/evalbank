import type { Setting } from "@prisma/client"

export interface IGroupedSettings {
  name: string
  value: string[]
}

export interface ISelectedSetting {
  name: string
  settings: Setting[] | undefined
}
