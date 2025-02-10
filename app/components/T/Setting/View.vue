<script setup lang="ts">
import type { ISetting } from "~~/shared/interface/setting"
import consola from "consola"

/**
 * @brief Component for displaying settings grouped by name.
 * @details This component organizes settings into tags and displays their values.
 */
const props = defineProps<{
  /**
   * An array of settings to display.
   */
  settings: ISetting[]
  /**
   * Whether to show the action button for each setting.
   */
  showActionButton?: boolean

  /**
   * Whether to show unsupported settings.
   */
  showControl?: boolean

  /**
   * Whether to show sync settings button for project id
   */
  showSyncProjectId?: string
}>()

const showUnsupported = ref(props.showControl ?? false)
const searchSetting = ref("")

const { data: settings } = useFetch<ISetting[]>(`/api/settings`)

/**
 * @brief Computed property to get unique setting names.
 * @returns An array of unique setting names.
 */
const settingsName = computed(() => {
  let filteredSettings
  if (showUnsupported.value) {
    filteredSettings = settings.value ?? []
  }
  else {
    filteredSettings = props.settings
  }

  if (searchSetting.value) {
    const searchValue = searchSetting.value.toLowerCase()
    filteredSettings = filteredSettings.filter(setting =>
      setting.name.toLowerCase().includes(searchValue) || setting.value.toLowerCase().includes(searchValue),
    )
  }

  return [...new Set(filteredSettings.map(c => c.name))].sort()
})

/**
 * @brief Retrieves settings by name.
 * @param name - The name of the setting.
 * @returns An array of settings with the specified name.
 */
function getSettingByName(name: string) {
  let filteredSettings
  if (showUnsupported.value) {
    filteredSettings = settings.value?.filter(f => f.name === name) ?? []
  }
  else {
    filteredSettings = props.settings.filter(f => f.name === name)
  }

  if (searchSetting.value) {
    const searchValue = searchSetting.value.toLowerCase()
    filteredSettings = filteredSettings.filter(setting =>
      setting.name.toLowerCase().includes(searchValue) || setting.value.toLowerCase().includes(searchValue),
    )
  }

  return filteredSettings.sort((a, b) => a.value.localeCompare(b.value))
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
const { state } = useSidebar()

const syncIds = ref<string[]>([])
const unsyncIds = ref<string[]>([])

function isModified(id: string) {
  return syncIds.value.includes(id) || unsyncIds.value.includes(id)
}
function hasModified() {
  if ((syncIds.value.length + unsyncIds.value.length) > 0) {
    return true
  }
  return false
}

function onSync() {
  const settingIds = props.settings.map(s => s.id).filter(f => !unsyncIds.value.includes(f))
  syncIds.value.map(id => settingIds.push(id))
  /** TODO */
  useSonner.promise(
    $fetch(`/api/projects/settings/sync`, {
      method: "patch",
      body: {
        projectId: props.showSyncProjectId,
        settingIds: JSON.stringify(settingIds),
      },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          /** TODO */
          useEventBus("refresh:projects").emit("all")
          unsyncIds.value = []
          syncIds.value = []
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Syncronize Project Settings ...",
      success: () => "Project settings has been updated.",
      error: () => "Error! Something went wrong during update settings!",
    },
  )
}
function onSettingSync(settingId: string, isSupported: boolean) {
  if (isSupported) {
    const extIdx = unsyncIds.value.findIndex(f => f === settingId)
    if (extIdx < 0) {
      unsyncIds.value.push(settingId)
    }
    else {
      unsyncIds.value.splice(extIdx, 1)
    }
  }
  else {
    const extIdx = syncIds.value.findIndex(f => f === settingId)
    if (extIdx < 0) {
      syncIds.value.push(settingId)
    }
    else {
      syncIds.value.splice(extIdx, 1)
    }
  }
}
</script>

<template>
  <div :class="[state === 'expanded' ? 'max-w-[calc(100vw-20rem)]' : 'max-w-[calc(100vw-8rem)]']">
    <div v-if="props.showControl" class="flex items-center justify-between gap-2 p-2">
      <UiInput v-model="searchSetting" placeholder="Search Settings" class="max-w-md m-1" />
      <div v-if="props.settings.length < (settings?.length ?? 0)" class="flex items-center space-x-2">
        <div v-if="props.showSyncProjectId && hasModified()" class="flex flex-row gap-1">
          <UiButton
            size="icon"
            variant="default"
            @click="onSync()"
          >
            <Icon class="size-4" name="lucide:refresh-ccw" />
          </UiButton>
        </div>
        <div class="flex flex-row gap-1">
          <UiLabel for="showUnsupported">
            Display All Settings
          </UiLabel>
          <UiSwitch id="displaySetting" v-model:checked="showUnsupported" />
        </div>
      </div>
    </div>
    <div class="flex flex-row flex-wrap flex-grow place-items-stretch gap-3 p-2">
      <!-- Render a tag for each unique setting name -->
      <div
        class="columns-1 sm:columns-2 md:columns-3 lg:columns-4 gap-2"
        :class="[state === 'expanded' ? 'max-w-[calc(100vw-20rem)]' : 'max-w-[calc(100vw-8rem)]']"
      >
        <div v-for="(name, index) in settingsName" :key="index" class="break-inside-avoid p-1 mb-4 bg-white rounded shadow">
          <div class="flex flex-row justify-between gap-2 items-center border-b-2 pb-1">
            <span class="font-bold">
              {{ name }}
            </span>
            <!-- Edit Button -->
            <UiButton
              v-if="showActionButton"
              size="icon"
              variant="outline"
              @click="navigateTo(`/settings/create?name=${name}`)"
            >
              <Icon class="size-4" name="lucide:plus" />
            </UiButton>
          </div>
          <div
            v-for="(setting, sIdx) in getSettingByName(name)" :key="sIdx"
            class="flex justify-between items-center mt-2"
            :class="{ 'text-red-500': !isSettingSupported(name, setting.value) }"
          >
            <div class="flex-grow text-sm truncate" @click="onSettingSync(setting.id, isSettingSupported(name, setting.value))">
              <span v-if="props.showSyncProjectId && isModified(setting.id)">
                *
              </span>
              {{ setting.value }}
            </div>
            <div class="flex items-center">
              <TActionButton
                v-if="showActionButton"
                :id="setting.id"
                endpoint="settings"
                :remove="true"
                :edit="true"
                class="ml-2"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
