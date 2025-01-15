<script lang="ts" setup>
import type { TooltipPortalProps } from "radix-vue"
import { TooltipPortal } from "radix-vue"

const props = defineProps<TooltipPortalProps>()
</script>

<template>
  <TooltipPortal v-bind="props">
    <slot />
  </TooltipPortal>
</template>
