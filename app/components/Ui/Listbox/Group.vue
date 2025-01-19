<script lang="ts" setup>
import type { ListboxGroupProps } from "radix-vue"
import { ListboxGroup, useForwardPropsEmits } from "radix-vue"

const props = defineProps<ListboxGroupProps>()
const forwarded = useForwardPropsEmits(props)
</script>

<template>
  <ListboxGroup v-bind="forwarded">
    <slot />
  </ListboxGroup>
</template>
