<script setup>
const props = defineProps({
  name: {
    type: String,
    required: true,
  },
  procedures: {
    type: String,
    required: true,
  },
})
const procedures = props.procedures.split("\n")
</script>

<template>
  <div class="flex items-center truncate text-ellipsis">
    <UiCollapsible class="space-y-2">
      <div class="flex items-center">
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
        <div v-for="(p, i) in procedures" :key="i" class="rounded-md border px-4 py-3 font-mono text-sm">
          {{ i + 1 }} -  {{ p }}
        </div>
        <UiSeparator />
        <UiCard
          class="w-[360px] max-w-sm"
          title="Checkitem 1"
        >
          <template #content>
            <UiCardContent>
              To do here
            </UiCardContent>
          </template>
        </UiCard>
      </UiCollapsibleContent>
    </UiCollapsible>
  </div>
</template>

<style lang="scss" scoped>

</style>
