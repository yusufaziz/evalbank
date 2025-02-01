<script lang="ts" setup>
import type { HoverCardArrowProps } from "radix-vue"
import { HoverCardArrow } from "radix-vue"

const props = withDefaults(
  defineProps<
    HoverCardArrowProps & {
      /** Custom class(es) to add to the parent */
      class?: any
    }
  >(),
  {
    height: 5,
    width: 10,
  },
)
const forwarded = reactiveOmit(props, "class")
const styles = tv({
  base: "fill-popover",
})
</script>

<template>
  <HoverCardArrow :class="styles({ class: props.class })" v-bind="forwarded" />
</template>
