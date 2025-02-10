<script setup lang="ts">
import type { ITestcase } from "~~/shared/interface/testcase"

/**
 * @brief Component for displaying a test case with procedures and check items.
 * @details This component fetches and displays details about a test case, including its procedures and associated check items.
 * It also provides options to sync or unsync the test case with a project.
 */
const props = defineProps({
  /**
   * The ID of the test case to display.
   */
  id: {
    type: String,
    required: true,
  },
  /**
   * Whether to show the sync button.
   */
  syncBtn: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether to show the unsync button.
   */
  unsyncBtn: {
    type: Boolean,
    default: false,
  },
})

// Fetch test case data
const { data: testcase } = useFetch<ITestcase>(`/api/testcases/${props.id}`)

/**
 * @brief Computed property to split the test case procedures into an array of strings.
 */
const procedures = computed(() => {
  return testcase.value?.procedures.split("\n").filter(p => p.trim().length > 0) || []
})

/**
 * @brief Handles syncing the test case with the current project.
 */
function onSyncdata() {
  const projectId = useRoute().params.projectId

  useSonner.promise(
    $fetch<any>("/api/projects/testcases/sync", {
      method: "patch",
      body: {
        projectId,
        testcaseId: props.id,
      },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Emit an event to refresh project data
          useEventBus("refresh:projects").emit("all")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Generating Evaluation Data ...",
      success: () => "Success generating evaluation data.",
      error: () => "Error! Something went wrong during data generation!",
    },
  )
}

/**
 * @brief Handles unsyncing the test case from the current project.
 */
function onUnSyncdata() {
  const projectId = useRoute().params.projectId

  useSonner.promise(
    $fetch<any>("/api/projects/testcases/unsync", {
      method: "patch",
      body: {
        projectId,
        testcaseId: props.id,
      },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Emit an event to refresh project data
          useEventBus("refresh:projects").emit("all")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Removing test case from project ...",
      success: () => "Success removing test case.",
      error: () => "Error! Something went wrong during data removal!",
    },
  )
}
</script>

<template>
  <UiCollapsible class="w-full">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold">
        {{ testcase?.name }}
      </h4>
      <div class="flex flex-row gap-2">
        <!-- Toggle Button -->
        <UiCollapsibleTrigger as-child>
          <UiButton variant="ghost" size="sm" class="w-9 p-0">
            <Icon name="lucide:chevrons-up-down" class="h-4 w-4" />
            <span class="sr-only">
              Toggle
            </span>
          </UiButton>
        </UiCollapsibleTrigger>

        <!-- Sync Button -->
        <UiButton
          v-if="useRoute().name === 'projects-projectId' && props.syncBtn"
          size="sm"
          class="w-9 p-0"
          @click="onSyncdata"
        >
          <Icon name="lucide:plus" class="h-4 w-4" />
        </UiButton>

        <!-- Unsync Button -->
        <UiButton
          v-if="useRoute().name === 'projects-projectId' && props.unsyncBtn"
          size="sm"
          class="w-9 p-0"
          @click="onUnSyncdata"
        >
          <Icon name="lucide:trash" class="h-4 w-4" />
          <span class="sr-only">
            Delete
          </span>
        </UiButton>
      </div>
    </div>

    <!-- Content Section -->
    <UiCollapsibleContent v-if="procedures.length > 0" class="">
      <!-- Procedures -->
      <UiDivider label="Procedures" />
      <p v-for="(p, i) in procedures" :key="i" class="text-sm">
        {{ i + 1 }}. {{ p }}
      </p>

      <!-- Check Items -->
      <UiDivider label="Checkitems" />
      <TCheckitemView
        v-for="(checkitem, i) in testcase?.checkitems || []"
        :key="i"
        class="mb-2"
        :checkitem="checkitem"
        :testcase-id="props.id"
        :show-evaluation="useRoute().name === 'projects-projectId' && props.unsyncBtn"
      />
    </UiCollapsibleContent>
  </UiCollapsible>
</template>

<style lang="scss" scoped>
/* Scoped styles can be added here if needed */
</style>
