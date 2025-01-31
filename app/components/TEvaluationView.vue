<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { IEvaluation } from "~~/shared/interface/evaluation"
import consola from "consola"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"

const props = defineProps<{
  evaluation: IEvaluation
}>()
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
            useEventBus("refresh:project").emit("all")
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
const files = ref<File[]>([])
watch(files, () => {
  consola.log("new files added", files.value)
  files.value = []
}, { deep: true })
</script>

<template>
  <UiDropfile class="max-w-sm" :open-on-click="false" @dropped="files = $event">
    <template #message>
      <div
        class="p-2 w-full" :class="{
          'border-2 rounded-sm': props.evaluation.judgement !== EVALUATION_JUDGEMENT.NOT_EXECUTED, // Thicker border if not NOT_EXECUTED
          'border-red-500': props.evaluation.judgement === EVALUATION_JUDGEMENT.NG, // Red border for NG
          'border-green-500': props.evaluation.judgement === EVALUATION_JUDGEMENT.OK, // Green border for OK
        }"
      >
        <div>
          <div
            v-for="(settingEval, idxSettingEval) in props.evaluation.settings"
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
              :model-value="props.evaluation.judgement?.toString()"
              @update:model-value="(value) => handleJudgementChange(props.evaluation, Number(value))"
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
    </template>
  </UiDropfile>
</template>
