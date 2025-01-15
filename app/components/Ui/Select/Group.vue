<script lang="ts" setup>
import type { SelectGroupProps } from "radix-vue"
import { SelectGroup, useForwardProps } from "radix-vue"

const props = defineProps<SelectGroupProps>()
const forwarded = useForwardProps(props)
</script>

<template>
  <SelectGroup v-bind="forwarded">
    <slot />
  </SelectGroup>
</template>
