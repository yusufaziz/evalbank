<script lang="ts" setup>
import type { PopoverAnchorProps } from "radix-vue"
import { PopoverAnchor, useForwardProps } from "radix-vue"

const props = defineProps<PopoverAnchorProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <PopoverAnchor v-bind="forwarded">
    <slot />
  </PopoverAnchor>
</template>
