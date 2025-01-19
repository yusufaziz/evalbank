<script lang="ts" setup>
import type { ScrollAreaCornerProps } from "radix-vue"
import { ScrollAreaCorner } from "radix-vue"

const props = defineProps<ScrollAreaCornerProps>()
</script>

<template>
  <ScrollAreaCorner v-bind="props">
    <slot />
  </ScrollAreaCorner>
</template>
