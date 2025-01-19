<script lang="ts" setup>
import type { NumberFieldIncrementProps } from "radix-vue"
import { NumberFieldIncrement, useForwardProps } from "radix-vue"

const props = withDefaults(
  defineProps<
    NumberFieldIncrementProps & {
      class?: any
      icon?: string
    }
  >(),
  { icon: "lucide:plus" },
)

const forwarded = useForwardProps(reactiveOmit(props, "class"))

const styles = tv({
  base: "flex h-full shrink-0 items-center justify-center bg-transparent p-3 focus:outline-none disabled:cursor-not-allowed disabled:opacity-50",
})
</script>

<template>
  <NumberFieldIncrement v-bind="forwarded" :class="styles({ class: props.class })">
    <slot>
      <Icon :name="props.icon" />
    </slot>
  </NumberFieldIncrement>
</template>
