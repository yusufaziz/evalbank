<script lang="ts" setup>
import type { EditableCancelTriggerProps } from "radix-vue"
import { EditableCancelTrigger } from "radix-vue"

const props = defineProps<EditableCancelTriggerProps>()
</script>

<template>
  <EditableCancelTrigger v-bind="props">
    <slot />
  </EditableCancelTrigger>
</template>
