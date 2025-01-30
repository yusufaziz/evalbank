<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { IEvaluation, IEvaluationPagination } from "~~/shared/interface/evaluation"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"

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

/**
 * @brief Handles the change in judgement for an evaluation.
 * @param evaluation - The evaluation object to update.
 * @param judgement - The new judgement value.
 */
function handleJudgementChange(evaluation: IEvaluation, judgement: number) {
  evaluation.judgement = judgement // Update the judgement
  useSonner.promise(
    $fetch<ICheckitem>(`/api/evaluations/${evaluation.id}`, {
      method: "patch",
      body: {
        judgement,
      },
    })
      .then((response) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            resolve(response)
          }, 1000) // 1-second delay
        })
      }),
    {
      loading: "Updating evaluation result",
      success: () => "Update sucess.",
      error: () => "Error! Something went wrong during updating data!",
    },
  )
  useEventBus("refresh:project").emit("all")
}
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
        <div
          v-for="(e, i) in evaluation?.evaluations" :key="i" class="border rounded-sm p-2" :class="{
            'border-2': e.judgement !== EVALUATION_JUDGEMENT.NOT_EXECUTED, // Thicker border if not NOT_EXECUTED
            'border-red-500': e.judgement === EVALUATION_JUDGEMENT.NG, // Red border for NG
            'border-green-500': e.judgement === EVALUATION_JUDGEMENT.OK, // Green border for OK
          }"
        >
          <div>
            <div
              v-for="(settingEval, idxSettingEval) in e.settings"
              :key="idxSettingEval"
              class="flex flex-row"
            >
              <span class="font-bold">{{ settingEval.name }}</span>
              <span>: {{ settingEval.value }}</span>
            </div>
          </div>
          <div>
            <UiToggleGroup class="item-start justify-start pt-2">
              <UiRadioGroup
                :model-value="e.judgement?.toString()"
                @update:model-value="(value) => handleJudgementChange(e, Number(value))"
              >
                <div class="flex space-x-2">
                  <UiRadioGroupItem id="r1" :value="EVALUATION_JUDGEMENT.NOT_SUPPORT.toString()" />
                  <UiLabel for="r1">
                    Not Supported
                  </UiLabel>
                </div>
                <div class="flex items-center space-x-2">
                  <UiRadioGroupItem id="r2" :value="EVALUATION_JUDGEMENT.NG.toString()" />
                  <UiLabel for="r2">
                    NG
                  </UiLabel>
                </div>
                <div class="flex items-center space-x-2">
                  <UiRadioGroupItem id="r3" :value="EVALUATION_JUDGEMENT.OK.toString()" />
                  <UiLabel for="r3">
                    OK
                  </UiLabel>
                </div>
              </UiRadioGroup>
            </UiToggleGroup>
          </div>
        </div>
      </div>
    </UiScrollArea>
  </div>
</template>
