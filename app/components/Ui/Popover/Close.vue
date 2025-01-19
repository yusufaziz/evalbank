<script lang="ts" setup>
import type { PopoverCloseProps } from "radix-vue"
import { PopoverClose, useForwardProps } from "radix-vue"

const props = defineProps<PopoverCloseProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <PopoverClose v-bind="forwarded">
    <slot />
  </PopoverClose>
</template>
