<script lang="ts" setup>
import type { Project } from "@prisma/client"
import type { IProject } from "~~/shared/interface/project"
import type { ISelectedSetting } from "~~/shared/interface/setting"
import { zodProjectSchema } from "~~/shared/schema/project"

const { data: project } = await useFetch<Partial<IProject>>(`/api/projects/${useRoute().params.projectId}/`)
const selectedSettings = ref<ISelectedSetting[]>([])

selectedSettings.value = populateSelectedSettings(project.value?.settings || [])
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
  initialValues: {
    ...project.value,
  },
})
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Project>(`/api/projects/${useRoute().params.projectId}`, {
      method: "patch",
      body: { ...data, settingIds: convertSelectedSetting(selectedSettings.value).map(s => s.id) },
    }),
    {
      loading: "Modifying Project ...",
      success: () => "Project information has been modified.",
      error: () => "Error! Something went wrong during modifying data!",
    },
  )
  navigateTo("/projects")
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
            <TSettingsSelection v-model="selectedSettings" />
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
