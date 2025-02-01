<script lang="ts" setup>
import type { HoverCardPortalProps } from "radix-vue"
import { HoverCardPortal } from "radix-vue"

const props = defineProps<HoverCardPortalProps>()
</script>

<template>
  <HoverCardPortal v-bind="props">
    <slot />
  </HoverCardPortal>
</template>
