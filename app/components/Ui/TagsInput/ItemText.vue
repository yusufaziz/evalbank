<script lang="ts" setup>
import type { TagsInputItemTextProps } from "radix-vue"
import { TagsInputItemText } from "radix-vue"

const props = defineProps<TagsInputItemTextProps & { class?: any }>()
const forwarded = reactiveOmit(props, "class")
const styles = tv({
  base: "leading-none sm:text-sm",
})
</script>

<template>
  <TagsInputItemText v-bind="forwarded" :class="styles({ class: props.class })">
    <slot />
  </TagsInputItemText>
</template>
