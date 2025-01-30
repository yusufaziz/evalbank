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
function onDelete() {
  useSonner.promise(
    $fetch<any>(`/api/${props.endpoint}/${props.id}`, {
      method: "delete",
    })
      .then((response) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            useEventBus("refresh:testcases").emit("all")
            useEventBus("refresh:settings").emit("all")
            useEventBus("refresh:projects").emit("all")
            resolve(response)
          }, 1000) // 1-second delay
        })
      }),
    {
      loading: "Deleting Data ...",
      success: () => "Data successfully deleted",
      error: () => "Error! Something went wrong during deleting data!",
    },
  )
}

function onDuplicate() {
  useSonner.promise(
    $fetch<any>(`/api/duplicate/`, {
      method: "POST",
      body: {
        type: props.endpoint,
        id: props.id,
      },
    })
      .then((response) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            useEventBus("refresh:testcases").emit("all")
            useEventBus("refresh:settings").emit("all")
            useEventBus("refresh:projects").emit("all")
            resolve(response)
          }, 1000) // 1-second delay
        })
      }),
    {
      loading: "Duplicating Data ...",
      success: () => "Data successfully duplicated",
      error: () => "Error! Something went wrong during duplicating data!",
    },
  )
}
</script>

<template>
  <div class="flex flex-auto gap-2">
    <UiButton v-if="props.duplicate" size="icon" variant="outline" @click="onDuplicate">
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
