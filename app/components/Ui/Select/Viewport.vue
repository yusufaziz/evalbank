<script lang="ts" setup>
import type { SelectViewportProps } from "radix-vue"
import { SelectViewport } from "radix-vue"

const props = defineProps<
  SelectViewportProps & {
    position?: "item-aligned" | "popper"
    /** Custom class(es) to add to the parent */
    class?: any
  }
>()
const forwarded = reactiveOmit(props, "class")
const styles = tv({
  base: "p-1",
  variants: {
    position: {
      "popper":
          "h-[var(--radix-select-trigger-height)] w-full min-w-[var(--radix-select-trigger-width)]",
      "item-aligned": "",
    },
  },
})
</script>

<template>
  <SelectViewport :class="styles({ position, class: props.class })" v-bind="forwarded">
    <slot />
  </SelectViewport>
</template>
