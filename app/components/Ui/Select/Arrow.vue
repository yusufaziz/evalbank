<script lang="ts" setup>
import type { SelectArrowProps } from "radix-vue"
import { SelectArrow, useForwardProps } from "radix-vue"

const props = withDefaults(defineProps<SelectArrowProps>(), {
  width: 10,
  height: 5,
})
</script>

<template>
  <SelectArrow v-bind="useForwardProps(props)" />
</template>
