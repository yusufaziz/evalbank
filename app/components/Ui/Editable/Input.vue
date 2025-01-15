<script lang="ts" setup>
import type { EditableInputProps } from "radix-vue"
import { EditableInput } from "radix-vue"

const props = defineProps<EditableInputProps>()
</script>

<template>
  <EditableInput v-bind="props">
    <slot />
  </EditableInput>
</template>
