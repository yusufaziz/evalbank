<script lang="ts" setup>
import type { EditableSubmitTriggerProps } from "radix-vue"
import { EditableSubmitTrigger } from "radix-vue"

const props = defineProps<EditableSubmitTriggerProps>()
</script>

<template>
  <EditableSubmitTrigger v-bind="props">
    <slot />
  </EditableSubmitTrigger>
</template>
