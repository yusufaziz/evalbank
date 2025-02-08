<script setup lang="ts">
import type { ISetting } from "~~/shared/interface/setting"

/**
 * @brief Component for displaying settings grouped by name.
 * @details This component organizes settings into tags and displays their values.
 */
const props = defineProps<{
  /**
   * An array of settings to display.
   */
  settings: ISetting[]
}>()

const showUnsupported = defineModel("showUnsupported", {
  type: Boolean,
  default: false,
})

const { data: settings } = useFetch<ISetting[]>(`/api/settings`)

/**
 * @brief Computes the unique names of settings for display.
 * @returns A sorted array of unique setting names.
 */
const settingsTags = computed(() => {
  if (showUnsupported.value) {
    return [...new Set(settings.value?.map(c => c.name))].sort()
  }
  else {
    return [...new Set(props.settings?.map(c => c.name))].sort()
  }
})

/**
 * @brief Retrieves the settings associated with a given name.
 * @param name - The name of the setting.
 * @returns A sorted array of settings associated with the name.
 */
function getSettingName(name: string) {
  if (showUnsupported.value) {
    return settings.value?.filter(f => f.name === name).map(m => m.value).sort() ?? []
  }
  else {
    return props.settings.filter(f => f.name === name).map(m => m.value).sort() ?? []
  }
}

/**
 * @brief Checks if a setting is supported.
 * @param name - The name of the setting.
 * @param value - The value of the setting.
 * @returns True if the setting is supported, false otherwise.
 */
function isSettingSupported(name: string, value: string) {
  if (showUnsupported.value) {
    return props.settings.some(s => s.name === name && s.value === value)
  }
  else {
    return true
  }
}
</script>

<template>
  <div class="flex flex-grow-0 place-items-start gap-3">
    <!-- Render a tag for each unique setting name -->
    <div v-for="(tag, index) in settingsTags" :key="index" class="grid w-md break-words text-sm text-wrap">
      <span class="font-bold border-b-2">{{ tag }}</span>
      <span v-for="(setting, sIdx) in getSettingName(tag)" :key="sIdx" :class="{ 'text-red-500': !isSettingSupported(tag, setting) }">{{ setting }}</span>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
