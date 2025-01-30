<script setup lang="ts">
import type { Setting } from "@prisma/client"

const props = defineProps<{
  settings: Setting[]
}>()

/**
 * @brief Computes the settings tags for display.
 * @output An array of strings representing the settings.
 */
const settingsTags = computed(() => {
  return [...new Set(props.settings?.map(c => c.name))]
})
</script>

<template>
  <div class="mt-2 flex flex-wrap gap-2">
    <p v-for="(tag, index) in settingsTags" :key="index" class="grid gap-2">
      <span class="text-sm font-bold border-b-2">{{ tag }}</span>
      <span class="text-sm">
        {{ props.settings?.filter(f => f.name === tag).map(m => m.value).join(", ") }}
      </span>
    </p>
  </div>
</template>
