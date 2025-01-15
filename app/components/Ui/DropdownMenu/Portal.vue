<script lang="ts" setup>
import type { DropdownMenuPortalProps } from "radix-vue"
import { DropdownMenuPortal } from "radix-vue"

const props = defineProps<DropdownMenuPortalProps>()
</script>

<template>
  <DropdownMenuPortal v-bind="props">
    <slot />
  </DropdownMenuPortal>
</template>
