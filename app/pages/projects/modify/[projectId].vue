<script lang="ts" setup>
import type { Project } from "@prisma/client"
import type { IProject, ISelectedSetting } from "~~/shared/interface/project"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { zodProjectSchema } from "~~/shared/schema/project"
import { populateSelectedSettings } from "~/utils/settings"

/**
 * @brief Component for modifying an existing project.
 * @details This component provides a form for updating project details and associated settings.
 */
const { data: project } = await useFetch<Partial<IProject>>(
  `/api/projects/${useRoute().params.projectId}/`,
)

// Initialize selected settings
const selectedSettings = ref<ISelectedSetting[]>([])
selectedSettings.value = populateSelectedSettings(project.value?.settings || [])

// Form setup with validation
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
  initialValues: {
    ...project.value,
  },
})

/**
 * @brief Handles form submission to modify an existing project.
 * @param data - The validated form data.
 */
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Project>(`/api/projects/${useRoute().params.projectId}`, {
      method: "patch",
      body: {
        ...data,
        settingIds: convertSelectedSetting(selectedSettings.value).map(s => s.id),
      },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          useRouter().back()
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Modifying Project ...",
      success: () => "Project information has been modified.",
      error: () => "Error! Something went wrong during modification!",
    },
  )
})
</script>

<template>
  <form id="projectModifyForm" class="mx-auto" @submit.prevent="onSubmit">
    <UiCard title="Modify Project">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Project Name" name="name" />
            <div class="flex flex-row gap-2">
              <UiVeeNumberField :min="20" :max="50" label="Model FY" name="modelFY">
                <UiNumberFieldInput placeholder="20" />
                <UiNumberFieldDecrement class="border-l" />
                <UiNumberFieldIncrement class="border-l" />
              </UiVeeNumberField>
              <UiVeeInput label="Model Series" name="modelSeries" />
              <UiVeeInput label="Model Name" name="modelName" />
            </div>
            <TSettingSelection v-model="selectedSettings" />
          </fieldset>
        </UiCardContent>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-start gap-5">
          <UiButton type="submit" form="projectModifyForm">
            Modify
          </UiButton>
          <UiButton variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </form>
</template>
