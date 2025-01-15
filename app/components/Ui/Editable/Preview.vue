<script lang="ts" setup>
import type { EditablePreviewProps } from "radix-vue"
import { EditablePreview } from "radix-vue"

const props = defineProps<EditablePreviewProps>()
</script>

<template>
  <EditablePreview v-bind="props">
    <slot />
  </EditablePreview>
</template>
