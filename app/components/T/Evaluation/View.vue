<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { IEvaluation } from "~~/shared/interface/evaluation"

import consola from "consola"
import { EVALUATION_JUDGEMENT } from "~~/shared/enum"

/**
 * @brief Component for displaying and updating an evaluation.
 * @details This component allows users to view evaluation details, update judgements, and upload files.
 */
const props = defineProps<{
  /**
   * The evaluation object to display and update.
   */
  evaluation: IEvaluation
}>()

const remarks = ref<string | null>(props.evaluation.remarks || null)
const judgement = ref<number | null>(props.evaluation.judgement || null)

/**
 * @brief Handles the change in judgement for an evaluation.
 * @param evaluation - The evaluation object to update.
 * @param judgement - The new judgement value.
 * @param remarks - Optional remarks for the evaluation.
 */
function handleJudgementChange() {
  const formData = new FormData()
  const data: { judgement: number, remarks?: string } = { judgement: judgement.value || 0 }

  consola.info("Judgement:", judgement)
  consola.info("Remarks:", remarks)

  if (remarks.value && remarks.value.trim() !== "") {
    data.remarks = remarks.value.trim()
  }

  formData.append("data", JSON.stringify(data)) // Prepare the form data

  useSonner.promise(
    $fetch<ICheckitem>(`/api/evaluations/${props.evaluation.id}`, {
      method: "patch",
      body: formData,
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Emit an event to refresh project data
          useEventBus("refresh:project").emit("all")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Updating evaluation result...",
      success: () => "Update successful.",
      error: () => "Error! Something went wrong during the update!",
    },
  )
}

function handleFileDrop(evaluation: IEvaluation, files: File[]) {
  if (files.length === 0) {
    consola.warn("No files to upload.")
    return
  }

  const formData = new FormData()
  files.forEach((file, index) => {
    formData.append(`files[${index}]`, file)
  })

  consola.info("Files dropped:", files)
  useSonner.promise(
    $fetch<ICheckitem>(`/api/evaluations/${evaluation.id}`, {
      method: "patch",
      body: formData,
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          // Emit an event to refresh project data
          useEventBus("refresh:project").emit("all")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Uploading files...",
      success: () => "Upload successful.",
      error: () => "Error! Something went wrong during the uploading!",
    },
  )
}
</script>

<template>
  <UiDropfile class="max-w-sm" :open-on-click="false" @dropped="(files) => handleFileDrop(props.evaluation, files)">
    <template #message>
      <div
        class="p-2 w-full"
        :class="{
          'border-2 rounded-sm': props.evaluation.judgement !== EVALUATION_JUDGEMENT.NOT_EXECUTED, // Thicker border if not NOT_EXECUTED
          'border-red-500': props.evaluation.judgement === EVALUATION_JUDGEMENT.NG, // Red border for NG
          'border-green-500': props.evaluation.judgement === EVALUATION_JUDGEMENT.OK, // Green border for OK
        }"
      >
        <!-- Display settings -->
        <div>
          <div
            v-for="(settingEval, idxSettingEval) in props.evaluation.settings"
            :key="idxSettingEval"
            class="flex flex-row "
          >
            <span class="font-bold text-nowrap">{{ settingEval.name }}</span>
            <p class="truncate hover:text-pretty  min-w-0">
              : {{ settingEval.value }}
            </p>
          </div>
        </div>

        <!-- Judgement radio buttons -->
        <div>
          <UiToggleGroup class="item-start justify-start pt-2">
            <UiRadioGroup
              :model-value="judgement?.toString()"
              class="flex flex-row gap-5"
              @update:model-value="(value) => { if (judgement) judgement = parseInt(value); handleJudgementChange() }"
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
          <div class="flex items-center gap-2 pt-2">
            <UiInput
              v-model="remarks"
              type="text"
              placeholder="Add remarks"
            />
            <UiButton @click="handleJudgementChange()">
              Save
            </UiButton>
          </div>
        </div>
      </div>
    </template>
  </UiDropfile>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
