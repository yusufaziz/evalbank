<script setup lang="ts">
import type { Setting } from "@prisma/client"
import type { ISetting } from "~~/shared/interface/setting"

/**
 * @brief Component for displaying settings grouped by name.
 * @details This component organizes settings into tags and displays their values.
 */
const props = defineProps<{
  /**
   * An array of settings to display.
   */
  settings: Setting[]
  /**
   * An boolean to check whether unsupported setting need to be displayed or not
   */
  showUnsupported: boolean
}>()

/**
 * @brief Computes the unique names of settings for display.
 * @returns An array of unique setting names.
 */
const settingsTags = computed(() => {
  return [...new Set(props.settings?.map(c => c.name))]
})
const { data: settings } = useFetch<ISetting>(`/api/settings`)
</script>

<template>
  <div class="mt-2 flex flex-wrap gap-2">
    <!-- Render a tag for each unique setting name -->
    <p v-for="(tag, index) in settingsTags" :key="index" class="grid gap-2 w-md break-words text-sm text-wrap">
      <span class="font-bold border-b-2">{{ tag }}</span>
      <span>
        {{ props.settings?.filter((f) => f.name === tag).map((m) => m.value).join(", ") }}
      </span>
    </p>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
