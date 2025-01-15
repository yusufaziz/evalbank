<script lang="ts" setup>
import type { PaginationEllipsisProps } from "radix-vue"
import { reactiveOmit } from "@vueuse/core"
import { PaginationEllipsis } from "radix-vue"

const props = defineProps<
  PaginationEllipsisProps & {
    /** Icon to show */
    icon?: string
  }
>()
const forwarded = reactiveOmit(props, "icon")
</script>

<template>
  <PaginationEllipsis v-bind="forwarded">
    <slot>
      <div v-if="icon" class="inline-flex h-9 w-9 items-center justify-center hover:bg-transparent">
        <Icon :name="icon" />
      </div>
    </slot>
  </PaginationEllipsis>
</template>
