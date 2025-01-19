<script lang="ts" setup>
import type { PopoverPortalProps } from "radix-vue"
import { PopoverPortal, useForwardProps } from "radix-vue"

const props = defineProps<PopoverPortalProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <PopoverPortal v-bind="forwarded">
    <slot />
  </PopoverPortal>
</template>
