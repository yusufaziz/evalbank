import type { Setting } from "@prisma/client"

interface ISelectedSetting {
  name: string
  settings: Setting[] | undefined
}

/**
 * @brief Transforms an array of settings into the selectedSettings format.
 *
 * @param settingsArray - An array of Setting objects.
 * @returns {ISelectedSetting[]} An array of ISelectedSetting objects grouped by setting name.
 */
export function populateSelectedSettings(settingsArray: Setting[]): ISelectedSetting[] {
  return settingsArray.reduce((acc, setting) => {
    const existing = acc.find(item => item.name === setting.name)
    if (existing) {
      existing.settings?.push(setting)
    }
    else {
      acc.push({ name: setting.name, settings: [setting] })
    }
    return acc
  }, [] as ISelectedSetting[])
}

/**
 * @brief Transforms an array of ISelectedSetting objects into a flat array of Setting objects.
 *
 * @param selectedSettingsArray - An array of ISelectedSetting objects.
 * @returns {Setting[]} A flat array of Setting objects.
 */
export function convertSelectedSetting(selectedSettingsArray: ISelectedSetting[]): Setting[] {
  return selectedSettingsArray.flatMap(item => item.settings || [])
}
