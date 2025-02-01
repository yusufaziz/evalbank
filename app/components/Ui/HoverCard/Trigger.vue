<script lang="ts" setup>
import type { HoverCardTriggerProps } from "radix-vue"
import { HoverCardTrigger } from "radix-vue"

defineOptions({ inheritAttrs: false })
const props = defineProps<HoverCardTriggerProps>()
</script>

<template>
  <HoverCardTrigger v-bind="props">
    <slot />
  </HoverCardTrigger>
</template>
