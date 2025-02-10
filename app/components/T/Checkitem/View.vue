<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { IEvaluationPagination } from "~~/shared/interface/evaluation"

/**
 * @brief Component for displaying a check item with optional evaluations.
 * @details This component shows details of a check item, including its module, expected target, and settings.
 * It also supports displaying evaluations and provides actions like edit and delete.
 */
const props = defineProps({
  /**
   * The check item object to display.
   */
  checkitem: {
    type: Object as () => Partial<ICheckitem>,
    required: true,
  },
  /**
   * The ID of the associated test case.
   */
  testcaseId: {
    type: String,
    default: "",
  },
  /**
   * Whether to show evaluations for the check item.
   */
  showEvaluation: {
    type: Boolean,
    default: false,
  },
  /**
   * Whether to show edit and delete actions for the check item.
   */
  modify: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits<{
  /**
   * Emitted when the edit action is triggered.
   * @param event - The event name ("edit").
   * @param checkitem - The check item to edit.
   */
  (event: "edit", checkitem: Partial<ICheckitem>): void
  /**
   * Emitted when the delete action is triggered.
   * @param event - The event name ("delete").
   * @param checkitem - The check item to delete.
   */
  (event: "delete", checkitem: Partial<ICheckitem>): void
}>()

// State variables
const page = ref(1)
const searchInput = ref("")
const search = useDebounce(searchInput, 500)

/**
 * @brief Computed property for constructing the query parameters for fetching evaluations.
 */
const query = computed(() => ({
  search: search.value,
  checkitemId: props.checkitem.id,
  testcaseId: props.testcaseId,
  projectId: useRoute().params.projectId,
  page: page.value,
  pageSize: 5,
}))

/**
 * @brief Fetches evaluations for the check item.
 */
const { data: evaluation, execute } = useFetch<IEvaluationPagination>("/api/evaluations", {
  query,
  onResponse: (response) => {
    if (page.value > response.response._data.totalPages) {
      page.value = 1 // Reset to the first page if current page exceeds total pages
    }
  },
  immediate: false, // Prevent immediate execution
})

onMounted(() => {
  if (props.showEvaluation) {
    execute() // Fetch evaluations only if showEvaluation is true
  }
})
</script>

<template>
  <div class="rounded-lg border border-input p-2">
    <!-- Header Section -->
    <div class="flex items-center justify-between">
      <div class="flex flex-row gap-1">
        <div class="flex flex-row gap-1 items-center">
          <UiBadge>
            {{ props.checkitem.module }}
          </UiBadge>
          <span>
            {{ props.checkitem.expectedTarget }}
          </span>
          <TEvaluationTestcaseInfo
            v-if="showEvaluation"
            :evaluation-count="evaluation?.evaluationCount"
          />
        </div>
      </div>
      <div class="flex flex-row gap-2">
        <div v-if="modify" class="flex gap-2">
          <!-- Edit Button -->
          <UiButton
            variant="outline"
            size="icon-sm"
            @click="emit('edit', props.checkitem)"
          >
            <Icon name="lucide:pencil" />
          </UiButton>
          <!-- Delete Button -->
          <UiButton
            variant="destructive"
            size="icon-sm"
            @click="emit('delete', props.checkitem)"
          >
            <Icon name="lucide:trash" />
          </UiButton>
        </div>
      </div>
    </div>

    <!-- Settings Section -->
    <div
      v-if="!props.showEvaluation"
      class="mt-2 flex flex-wrap gap-2"
    >
      <TSettingView :settings="props.checkitem.settings || []" />
    </div>

    <!-- Evaluations Section -->
    <UiScrollArea
      v-if="props.showEvaluation"
      class="h-[300px] w-full"
    >
      <div class="flex gap-3 p-2">
        <div class="flex w-full justify-between">
          <!-- Search Input -->
          <UiInput
            v-model="searchInput"
            placeholder="Search"
            class="max-w-md"
          />
          <!-- Pagination -->
          <UiPagination
            v-model:page="page"
            :total="evaluation?.totalEvaluations"
            :items-per-page="5"
            :sibling-count="1"
          />
        </div>
      </div>
      <div class="p-2 text-sm flex flex-wrap gap-3">
        <!-- Evaluation List -->
        <TEvaluationView
          v-for="(e, i) in evaluation?.evaluations"
          :key="i"
          :evaluation="e"
        />
      </div>
    </UiScrollArea>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
