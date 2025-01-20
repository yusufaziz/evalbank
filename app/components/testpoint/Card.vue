<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <div class="flex flex-row">
        {{ props.title }}
    </div>
  </div>
</template>

<style scoped>

</style>
