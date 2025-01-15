<script lang="ts" setup>
import type { CollapsibleTriggerProps } from "radix-vue"
import { CollapsibleTrigger, useForwardProps } from "radix-vue"

const props = defineProps<CollapsibleTriggerProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <CollapsibleTrigger v-bind="forwarded">
    <slot />
  </CollapsibleTrigger>
</template>
