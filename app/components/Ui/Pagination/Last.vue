<script lang="ts" setup>
import type { PaginationLastProps } from "radix-vue"
import { reactiveOmit } from "@vueuse/core"
import { PaginationLast } from "radix-vue"

const props = defineProps<
  PaginationLastProps & {
    /** Icon to show */
    icon?: string
  }
>()
const forwarded = reactiveOmit(props, "icon")
</script>

<template>
  <PaginationLast v-bind="forwarded">
    <slot>
      <UiButton v-if="icon" variant="ghost" size="icon-sm">
        <Icon :name="icon" />
      </UiButton>
    </slot>
  </PaginationLast>
</template>
