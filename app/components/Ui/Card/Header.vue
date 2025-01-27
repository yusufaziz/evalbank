<script lang="ts" setup>
import type { PrimitiveProps } from "radix-vue"
import { Primitive } from "radix-vue"

const props = withDefaults(
  defineProps<
    PrimitiveProps & {
      /** Custom class(es) to add to the element */
      class?: any
    }
  >(),
  { as: "div" },
)

const styles = tv({
  base: "flex flex-col space-y-1.5 p-6 [&+*]:pt-0",
})
</script>

<template>
  <Primitive :class="styles({ class: props.class })" :as="as" :as-child="asChild">
    <slot />
  </Primitive>
</template>
