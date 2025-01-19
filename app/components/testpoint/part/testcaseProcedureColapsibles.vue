<script setup lang="ts">
import type { Checkitem } from "@prisma/client" // Import the Checkitem type

const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  procedures: {
    type: String,
    required: true,
  },
  checkitems: {
    type: Array as () => Checkitem[],
    required: true,
  },
})
const procedures = props.procedures.split("\n")
</script>

<template>
  <div class="flex items-center truncate text-ellipsis">
    <UiCollapsible class="space-y-2">
      <div class="flex items-center justify-between w-[600px]">
        <h4 class="text-sm font-semibold">
          {{ props.name }}
        </h4>
        <UiCollapsibleTrigger as-child>
          <UiButton variant="ghost" size="sm" class="w-9 p-0">
            <Icon name="lucide:chevrons-up-down" class="h-4 w-4" />
            <span class="sr-only">Toggle</span>
          </UiButton>
        </UiCollapsibleTrigger>
      </div>
      <UiCollapsibleContent v-if="procedures.length > 1" class="space-y-2">
        <UiDivider label="Procedures" />
        <p v-for="(p, i) in procedures" :key="i" class="text-sm">
          {{ i + 1 }}.  {{ p }}
        </p>
        <UiDivider label="Checkitems" />
        <TestpointPartViewCheckitem v-for="(checkitem, i) in checkitems" :key="i" :checkitem="checkitem" />
      </UiCollapsibleContent>
    </UiCollapsible>
  </div>
</template>

<style lang="scss" scoped>

</style>
