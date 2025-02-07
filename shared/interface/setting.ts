import type { Setting } from "@prisma/client"

/**
 * @brief Interface representing grouped settings by name.
 */
export interface IGroupedSettings {
  name: string // Name of the setting group
  value: string[] // Values within the group
}

/**
 * @brief Interface representing a selected setting with its related settings.
 */
export interface ISelectedSetting {
  name: string // Name of the setting
  settings: Setting[] | undefined // Related settings
}

export interface ISetting {
  id: string
  name: string
  value: string
}
