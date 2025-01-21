<script setup lang="ts">
import type { Checkitem } from "@prisma/client"

const props = defineProps({
  checkitem: {
    type: Object as () => Checkitem,
    required: true,
  },
  modify: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
})

const emit = defineEmits(["edit", "delete", "needRefresh"])

// Split requiredSettings into an array of tags
const requiredSettingsTags = computed(() => {
  return props.checkitem.requiredSettings?.split("|") || []
})
</script>

<template>
  <div class="rounded-lg border border-input p-2">
    <div class="flex items-center justify-between">
      <span>{{ props.checkitem.expectedTarget }}</span>
      <div class="flex flex-row gap-2">
        <UiBadge>{{ props.checkitem.module }}</UiBadge>
        <div v-if="modify" class="flex gap-2">
          <UiButton variant="outline" size="icon-xs" @click="emit('edit', props.checkitem)">
            <Icon name="lucide:pencil" />
          </UiButton>
          <UiButton variant="destructive" size="icon-xs" @click="emit('delete', props.checkitem)">
            <Icon name="lucide:trash" />
          </UiButton>
        </div>
      </div>
    </div>
    <div v-if="requiredSettingsTags.length > 0 && !props.checkitem.evaluations" class="mt-2 flex flex-wrap gap-2">
      <UiBadge v-for="(tag, index) in requiredSettingsTags" :key="index" variant="secondary">
        {{ tag.trim() }}
      </UiBadge>
    </div>
    <div v-if="props.checkitem.evaluations" class="p-2 text-sm flex flex-wrap gap-3">
      Total Evaluation : {{ props.checkitem.evaluations.length }}
      <div v-for="(e, i) in props.checkitem.evaluations" :key="i" class="border">
        <div>
          {{ i }}. {{ e.settings.map(s => `${s.name}: ${s.value}`).join(", ") }}
        </div>
        <div>
          <UiToggleGroup>
            <UiToggleGroupItem variant="outline" value="bold" icon="lucide:" />
            <UiToggleGroupItem variant="outline" value="italic" icon="lucide:x" />
            <UiToggleGroupItem variant="outline" value="underline" icon="lucide:check" />
          </UiToggleGroup>
        </div>
      </div>
    </div>
  </div>
</template>
