<script setup lang="ts">
import type { Setting } from "@prisma/client"

interface ISelectedSetting {
  name: string
  settings: Setting[] | undefined
}

const emit = defineEmits(["update:selectedSettings"])
const { data: settings } = useFetch<Setting[]>("/api/settings")
const selectedSettings = ref<ISelectedSetting[]>([])
const showAdditional = ref<string | null>(null)

/**
 * @brief Watches for changes in selectedSettings and emits the updated value.
 */
watch(selectedSettings, () => {
  emit("update:selectedSettings", selectedSettings.value)
}, { deep: true, flush: "post" })

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
</script>

<template>
  <div>
    <UiScrollArea class="h-[calc(100vh-300px)] w-full rounded-md border p-4">
      <div v-for="(item, index) in selectedSettings" :key="index" class="mb-4">
        <div class="flex items-center gap-2">
          <UiSelect v-model="item.name" @update:model-value="handleSettingSelection(index, $event)">
            <UiSelectTrigger placeholder="Select a Setting" />
            <UiSelectContent>
              <UiSelectItem
                v-for="(settingName, i) in [...new Set(settings?.map(f => f.name))]"
                :key="i"
                :value="settingName"
                :text="settingName"
              />
            </UiSelectContent>
          </UiSelect>
          <UiButton
            :variant="item.settings?.length === settings?.filter(f => f.name === item.name).length ? 'default' : 'ghost'"
            size="icon"
            @click="showAdditional = showAdditional === item.name ? null : item.name"
          >
            <Icon class="size-4" name="lucide:list-collapse" />
          </UiButton>
          <UiButton variant="destructive" size="icon" @click="selectedSettings.splice(index, 1)">
            <Icon class="size-4" name="lucide:trash" />
          </UiButton>
        </div>
        <div v-if="showAdditional && showAdditional === item.name" class="mt-2">
          <UiListbox v-model="item.settings" multiple>
            <UiListboxContent v-if="settings">
              <UiListboxItem
                v-for="(setting, i) in settings.filter(f => f.name === item.name)"
                :key="i"
                :value="setting?.id"
                :text="setting?.value"
              >
                <span>{{ setting?.value }}</span>
              </UiListboxItem>
            </UiListboxContent>
          </UiListbox>
        </div>
      </div>
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
