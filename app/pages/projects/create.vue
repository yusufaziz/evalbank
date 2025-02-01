<script lang="ts" setup>
import type { Project } from "@prisma/client"
import type { ISelectedSetting } from "~~/shared/interface/setting"
import { toTypedSchema } from "@vee-validate/zod"
import consola from "consola"
import { useForm } from "vee-validate"
import { zodProjectSchema } from "~~/shared/schema/project"

/**
 * @brief Component for creating a new project.
 * @details This component provides a form for entering project details and selecting settings.
 */
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
})

const selectedSettings = ref<ISelectedSetting[]>([])

/**
 * @brief Handles form submission to create a new project.
 * @param data - The validated form data.
 */
const onSubmit = handleSubmit(async (data) => {
  consola.log(data)
  await useSonner.promise(
    $fetch<Project>("/api/projects", {
      method: "PUT",
      body: {
        ...data,
        author: "dummy-author-id",
        settingIds: convertSelectedSetting(selectedSettings.value).map(s => s.id),
      },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo("/projects")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Creating Project ...",
      success: () => "Project has been added to the database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Create Project">
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
          <UiButton type="submit">
            Create Project
          </UiButton>
          <UiButton variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </form>
</template>
