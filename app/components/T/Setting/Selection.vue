<script setup lang="ts">
import type { Setting } from "@prisma/client"

import { populateSelectedSettings } from "~/utils/settings"

/**
 * @brief Interface representing a selected setting.
 */
interface ISelectedSetting {
  /**
   * The name of the setting.
   */
  name: string
  /**
   * The array of settings associated with the name.
   */
  settings: Setting[] | undefined
}

/**
 * @brief Component for selecting and managing required settings.
 * @details This component allows users to select settings from a dropdown, manage their values, and emit changes to the parent component.
 */
const props = defineProps<{
  /**
   * The initial value of selected settings, provided as an array of ISelectedSetting objects.
   */
  modelValue: ISelectedSetting[]
}>()

/**
 * @brief Emits updated selected settings to the parent component.
 */
const emit = defineEmits<{
  /**
   * Emitted when the selected settings are updated.
   * @param event - The event name ("update:modelValue").
   * @param value - The updated array of selected settings.
   */
  (event: "update:modelValue", value: ISelectedSetting[]): void
}>()

// Fetch all available settings from the API
const { data: settings } = useFetch<Setting[]>("/api/settings")

// State variables
const selectedSettings = ref<ISelectedSetting[]>(props.modelValue || [])
const showAdditional = ref<string | null>(null)
const settingSearch = ref<string>("")

/**
 * @brief Watches for changes in selectedSettings and emits the updated value.
 */
watch(
  selectedSettings,
  () => {
    emit("update:modelValue", selectedSettings.value)
  },
  { deep: true, flush: "post" },
)

/**
 * @brief Handles the selection of a setting from the dropdown.
 * @param index - The index of the selected setting in the selectedSettings array.
 * @param settingName - The name of the selected setting.
 */
function handleSettingSelection(index: number, settingName: string) {
  selectedSettings.value[index] = {
    name: settingName,
    settings: settings.value?.filter(f => f.name === settingName),
  }
}

/**
 * @brief Initializes the selectedSettings array when the modelValue prop changes.
 */
watch(
  () => props.modelValue,
  (newValue) => {
    if (newValue) {
      selectedSettings.value = newValue
    }
  },
  { immediate: true, deep: true },
)

/**
 * @brief Populates the selectedSettings array with an array of settings.
 * @param settingsArray - An array of Setting objects to populate the selectedSettings.
 */
function initializeSelectedSettings(settingsArray: Setting[]) {
  selectedSettings.value = populateSelectedSettings(settingsArray)
}

// Expose the initializeSelectedSettings function to the parent component
defineExpose({ initializeSelectedSettings })
</script>

<template>
  <div>
    <label class="block text-sm font-medium text-gray-700 mb-1">
      Required Settings
    </label>
    <UiScrollArea class="h-[calc(100vh-380px)] w-full rounded-md border p-4">
      <!-- Render each selected setting -->
      <div v-for="(item, index) in selectedSettings" :key="index" class="mb-4">
        <div class="flex items-center gap-2">
          <!-- Dropdown for selecting a setting -->
          <UiSelect
            v-model="item.name"
            @update:model-value="handleSettingSelection(index, $event)"
          >
            <UiSelectTrigger placeholder="Select a Setting" />
            <UiSelectContent>
              <div class="flex items-center gap-2 mb-2">
                <UiInput v-model="settingSearch" type="text" placeholder="Search settings" />
              </div>
              <UiSelectItem
                v-for="(settingName, i) in [...new Set(settings?.map((f) => f.name))].filter((f) =>
                  f.toLowerCase().includes(settingSearch.toLowerCase()),
                )"
                :key="i"
                :value="settingName"
                :text="settingName"
                :style="{ display: selectedSettings.some((s) => s.name === settingName) ? 'none' : 'block' }"
              />
            </UiSelectContent>
          </UiSelect>

          <!-- Button to toggle additional settings -->
          <UiButton
            :variant="
              item.settings?.length
                === settings?.filter((f) => f.name === item.name).length
                ? 'default'
                : 'ghost'
            "
            size="icon"
            @click="showAdditional = showAdditional === item.name ? null : item.name"
          >
            <Icon class="size-4" name="lucide:list-collapse" />
          </UiButton>

          <!-- Button to remove the selected setting -->
          <UiButton
            variant="destructive"
            size="icon"
            @click="selectedSettings.splice(index, 1)"
          >
            <Icon class="size-4" name="lucide:trash" />
          </UiButton>
        </div>

        <!-- Additional settings listbox -->
        <div v-if="showAdditional && showAdditional === item.name" class="mt-2">
          <UiListbox v-model="item.settings" multiple>
            <UiListboxContent v-if="settings">
              <div class="flex items-center gap-2 mb-2">
                <UiInput v-model="settingSearch" type="text" placeholder="Search settings" />
                <UiButton variant="outline" size="sm" @click="item.settings = settings.filter((f) => f.name === item.name)">
                  Select All
                </UiButton>
                <UiButton variant="outline" size="sm" @click="item.settings = []">
                  Clear All
                </UiButton>
              </div>
              <UiListboxItem
                v-for="(setting, i) in settings.filter((f) => f.name === item.name)"
                :key="i"
                :value="setting"
                :text="setting?.value"
              >
                <span>
                  {{ setting?.value }}
                </span>
              </UiListboxItem>
            </UiListboxContent>
          </UiListbox>
        </div>
      </div>

      <!-- Button to add a new setting -->
      <UiButton
        variant="outline"
        size="sm"
        class="text-sm"
        @click="selectedSettings.push({ name: '', settings: [] })"
      >
        Add Other Setting
      </UiButton>
    </UiScrollArea>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
