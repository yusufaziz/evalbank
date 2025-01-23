<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { IEvaluation } from "~~/shared/interface/evaluation"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"

const props = defineProps({
  checkitem: {
    type: Object as () => Partial<ICheckitem>,
    required: true,
  },
  modify: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
})

const emit = defineEmits(["edit", "delete", "needRefresh"])

/**
 * @brief Computes the settings tags for display.
 * @output An array of strings representing the settings.
 */
const settingsTags = computed(() => {
  return [...new Set(props.checkitem.settings?.map(c => c.name))]
    .map(
      name =>
        `${name}: ${props.checkitem.settings
          ?.filter(f => f.name === name)
          .map(s => s.value)
          .join(",")}`,
    ) || []
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
            emit("needRefresh")
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
}
</script>

<template>
  <div class="rounded-lg border border-input p-2">
    <div class="flex items-center justify-between">
      <div class="flex flex-row gap-1">
        <UiBadge>{{ props.checkitem.module }}</UiBadge>
        <span>{{ props.checkitem.expectedTarget }}</span>
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
    <div v-if="settingsTags.length > 0 && !props.checkitem.evaluations" class="mt-2 flex flex-wrap gap-2">
      <UiBadge v-for="(tag, index) in settingsTags" :key="index" variant="secondary">
        {{ tag }}
      </UiBadge>
    </div>
    <div v-if="props.checkitem.evaluations" class="p-2 text-sm flex flex-wrap gap-3">
      <div
        v-for="(e, i) in props.checkitem.evaluations" :key="i" class="border rounded-sm p-2" :class="{
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
  </div>
</template>
