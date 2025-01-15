<script lang="ts" setup>
import type { PaginationNextProps } from "radix-vue"
import { reactiveOmit } from "@vueuse/core"
import { PaginationNext } from "radix-vue"

const props = defineProps<
  PaginationNextProps & {
    /** Icon to show */
    icon?: string
  }
>()

const forwarded = reactiveOmit(props, "icon")
</script>

<template>
  <PaginationNext v-bind="forwarded">
    <slot>
      <UiButton v-if="icon" variant="ghost" size="icon-sm">
        <Icon :name="icon" />
      </UiButton>
    </slot>
  </PaginationNext>
</template>
