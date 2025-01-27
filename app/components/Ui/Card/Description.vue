<script lang="ts" setup>
import type { PrimitiveProps } from "radix-vue"
import { Primitive } from "radix-vue"

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      /** Description to display in the card */
      description?: string
      /** Custom class(es) to add to the element */
      class?: any
    }
  >(),
  {
    as: "div",
  },
)
const styles = tv({
  base: "text-sm text-muted-foreground",
})
</script>

<template>
  <Primitive :class="styles({ class: props.class })" :as="as" :as-child="asChild">
    <slot>
      {{ description }}
    </slot>
  </Primitive>
</template>
