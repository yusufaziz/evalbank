<script lang="ts" setup>
import type { HoverCardRootEmits, HoverCardRootProps } from "radix-vue"
import { HoverCardRoot, useForwardPropsEmits } from "radix-vue"

const props = withDefaults(defineProps<HoverCardRootProps>(), {
  openDelay: 200,
  closeDelay: 200,
})

const emits = defineEmits<HoverCardRootEmits>()
const forwarded = useForwardPropsEmits(props, emits)
</script>

<template>
  <HoverCardRoot v-bind="forwarded">
    <slot />
  </HoverCardRoot>
</template>
