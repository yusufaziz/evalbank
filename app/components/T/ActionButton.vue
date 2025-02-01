<script setup lang="ts">
/**
 * @brief Component for rendering action buttons (e.g., duplicate, view, edit, delete).
 * @details This component provides reusable buttons for performing actions on entities like test cases, settings, or projects.
 */
const props = defineProps({
  /**
   * Unique identifier for the entity.
   */
  id: {
    type: String,
    required: true,
  },
  /**
   * API endpoint associated with the entity (e.g., "testcases", "settings").
   */
  endpoint: {
    type: String,
    required: true,
  },
  /**
   * Whether to show the duplicate button.
   */
  duplicate: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether to show the view button.
   */
  view: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether to show the edit button.
   */
  edit: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether to show the delete button.
   */
  remove: {
    type: Boolean,
    default: false,
  },
})

/**
 * @brief Handles the deletion of an entity.
 * @details Sends a DELETE request to the API and emits events to refresh related data.
 */
function onDelete() {
  useSonner.promise(
    $fetch<any>(`/api/${props.endpoint}/${props.id}`, {
      method: "delete",
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Emit events to refresh related data
          useEventBus("refresh:testcases").emit("all")
          useEventBus("refresh:settings").emit("all")
          useEventBus("refresh:projects").emit("all")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Deleting Data ...",
      success: () => "Data successfully deleted",
      error: () => "Error! Something went wrong during deleting data!",
    },
  )
}

/**
 * @brief Handles the duplication of an entity.
 * @details Sends a POST request to the API and emits events to refresh related data.
 */
function onDuplicate() {
  useSonner.promise(
    $fetch<any>("/api/duplicate/", {
      method: "POST",
      body: {
        type: props.endpoint,
        id: props.id,
      },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Emit events to refresh related data
          useEventBus("refresh:testcases").emit("all")
          useEventBus("refresh:settings").emit("all")
          useEventBus("refresh:projects").emit("all")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
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
    <!-- Duplicate Button -->
    <UiButton v-if="props.duplicate" size="icon" variant="outline" @click="onDuplicate">
      <Icon class="size-4" name="lucide:copy" />
    </UiButton>

    <!-- View Button -->
    <UiButton v-if="props.view" size="icon" variant="outline" @click="navigateTo(`/${props.endpoint}/${props.id}`)">
      <Icon class="size-4" name="lucide:eye" />
    </UiButton>

    <!-- Edit Button -->
    <UiButton v-if="props.edit" size="icon" variant="shine" @click="navigateTo(`/${props.endpoint}/modify/${props.id}`)">
      <Icon class="size-4" name="lucide:pencil" />
    </UiButton>

    <!-- Delete Button -->
    <UiButton v-if="props.remove" size="icon" variant="destructive" @click="onDelete">
      <Icon class="size-4" name="lucide:trash" />
    </UiButton>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
