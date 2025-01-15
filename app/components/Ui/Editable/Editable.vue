<script lang="ts" setup>
import type { EditableRootEmits, EditableRootProps } from "radix-vue"
import { EditableRoot, useForwardExpose, useForwardPropsEmits } from "radix-vue"

const props = defineProps<EditableRootProps>()
const emit = defineEmits<EditableRootEmits & { ready: [v?: any] }>()
const { currentRef, forwardRef } = useForwardExpose()
const forwarded = useForwardPropsEmits(props, emit)

onMounted(() => {
  // Emit the ready event with the current ref value
  emit("ready", currentRef)
})
</script>

<template>
  <EditableRoot :ref="forwardRef" v-slot="slotProps" v-bind="forwarded">
    <slot v-bind="slotProps" />
  </EditableRoot>
</template>
