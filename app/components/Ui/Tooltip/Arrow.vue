<script lang="ts" setup>
import type { TooltipArrowProps } from "radix-vue"
import { TooltipArrow } from "radix-vue"

const props = withDefaults(defineProps<TooltipArrowProps>(), {
  width: 10,
  height: 5,
})
</script>

<template>
  <TooltipArrow v-bind="props" />
</template>
