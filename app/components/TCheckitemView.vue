<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { IEvaluation, IEvaluationPagination } from "~~/shared/interface/evaluation"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"
import TEvaluationView from "./TEvaluationView.vue"

const props = defineProps({
  checkitem: {
    type: Object as () => Partial<ICheckitem>,
    required: true,
  },
  testcaseId: {
    type: String,
    default: () => "",
  },
  showEvaluation: {
    type: Boolean,
    default: false,
  },
  modify: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
})

const emit = defineEmits(["edit", "delete"])
const page = ref(1)
const searchInput = ref("")
const search = useDebounce(searchInput, 500)

const query = computed(() => ({
  search: search.value,
  checkitemId: props.checkitem.id,
  testcaseId: props.testcaseId,
  projectId: useRoute().params.projectId,
  page: page.value,
  pageSize: 5,
}))

// Use the reactive query in useFetch
const { data: evaluation, execute } = useFetch<IEvaluationPagination>(`/api/evaluations`, {
  query,
  onResponse: (response) => {
    if (page.value > response.response._data.totalPages) {
      page.value = 1
    }
  },
  immediate: false,
})

onMounted(() => {
  if (props.showEvaluation) {
    execute()
  }
})
</script>

<template>
  <div class="rounded-lg border border-input p-2">
    <div class="flex items-center justify-between">
      <div class="flex flex-row gap-1">
        <UiBadge>{{ props.checkitem.module }}</UiBadge>
        <span>{{ props.checkitem.expectedTarget }}</span>
        <span v-if="showEvaluation">[OK: {{ evaluation?.evaluationCount?.OK }}]</span>
        <span v-if="showEvaluation">[NG: {{ evaluation?.evaluationCount?.NG }}]</span>
        <span v-if="showEvaluation">[Not Executed: {{ evaluation?.evaluationCount?.NOT_EXECUTED }}]</span>
        <span v-if="showEvaluation">[Not Supported: {{ evaluation?.evaluationCount?.NOT_SUPPORT }}]</span>
      </div>
      <div class="flex flex-row gap-2">
        <div v-if="modify" class="flex gap-2">
          <UiButton variant="outline" size="icon-xs" @click="emit('edit', props.checkitem)">
            <Icon name="lucide:pencil" />
          </UiButton>
          <UiButton variant="destructive" size="icon-xs" @click="emit('delete', props.checkitem)">
            <Icon name="lucide:trash" />
          </UiButton>
        </div>
      </div>
    </div>
    <div v-if="!props.showEvaluation" class="mt-2 flex flex-wrap gap-2">
      <TSettingView :settings="props.checkitem.settings || []" />
    </div>
    <UiScrollArea v-if="props.showEvaluation" class="h-[300px] w-full">
      <div class="flex gap-3 p-2">
        <div class="flex w-full justify-between">
          <UiInput v-model="searchInput" placeholder="Search" class="max-w-md" />
          <UiPagination v-model:page="page" :total="evaluation?.totalEvaluations" :items-per-page="5" :sibling-count="1" />
        </div>
      </div>
      <div class="p-2 text-sm flex flex-wrap gap-3">
        <TEvaluationView v-for="(e, i) in evaluation?.evaluations" :key="i" :evaluation="e" />
      </div>
    </UiScrollArea>
  </div>
</template>
