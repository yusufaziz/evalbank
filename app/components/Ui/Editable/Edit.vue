<script lang="ts" setup>
import type { EditableEditTriggerProps } from "radix-vue"
import { EditableEditTrigger } from "radix-vue"

const props = defineProps<EditableEditTriggerProps>()
</script>

<template>
  <EditableEditTrigger v-bind="props">
    <slot />
  </EditableEditTrigger>
</template>
