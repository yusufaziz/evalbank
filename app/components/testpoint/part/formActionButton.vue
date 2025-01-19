<script setup lang="ts">
const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  endpoint: {
    type: String,
    required: true,
  },
  duplicate: {
    type: Boolean,
    default: false,
  },
  view: {
    type: Boolean,
    default: false,
  },
  edit: {
    type: Boolean,
    default: false,
  },
  remove: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(["postdelete"])
async function onDelete() {
  await useSonner.promise(
    $fetch<any>(`/api/${props.endpoint}/${props.id}`, {
      method: "delete",
    }),
    {
      loading: "Deleting Data ...",
      success: () => "Data sucessfully deleted",
      error: () => "Error! Something went wrong during deleting data!",
    },
  )
  emit("postdelete")
}
</script>

<template>
  <div class="flex flex-auto gap-2">
    <UiButton v-if="props.duplicate" size="icon" variant="outline">
      <Icon class="size-4" name="lucide:copy" />
    </UiButton>
    <UiButton v-if="props.view" size="icon" variant="outline" @click="navigateTo(`/${endpoint}/${id}`)">
      <Icon class="size-4" name="lucide:eye" />
    </UiButton>
    <UiButton v-if="props.edit" size="icon" variant="shine" @click="navigateTo(`/${endpoint}/modify/${id}`)">
      <Icon class="size-4" name="lucide:pencil" />
    </UiButton>
    <UiButton v-if="props.remove" size="icon" variant="destructive" @click="onDelete">
      <Icon class="size-4" name="lucide:trash" />
    </UiButton>
  </div>
</template>

<style scoped>

</style>
