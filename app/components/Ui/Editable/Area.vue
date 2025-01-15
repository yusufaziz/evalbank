<script lang="ts" setup>
import type { EditableAreaProps } from "radix-vue"
import { EditableArea } from "radix-vue"

const props = defineProps<EditableAreaProps>()
</script>

<template>
  <EditableArea v-bind="props">
    <slot />
  </EditableArea>
</template>
