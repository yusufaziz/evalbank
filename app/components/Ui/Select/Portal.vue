<script lang="ts" setup>
import type { SelectPortalProps } from "radix-vue"
import { SelectPortal } from "radix-vue"

const props = defineProps<SelectPortalProps>()
</script>

<template>
  <SelectPortal v-bind="props">
    <slot />
  </SelectPortal>
</template>
