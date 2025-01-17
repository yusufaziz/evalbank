<script lang="ts" setup>
import type { Project } from "@prisma/client"
import { zodProjectSchema } from "~~/shared/schema/project"

const { data: project } = await useFetch<Project>(`/api/projects/${useRoute().params.projectId}`)
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
      body: data,
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
  <div class="flex items-center">
    <UiCard
      class="w-[600px]"
      title="Modify Project"
      description="Modify the Project information."
    >
      <template #content>
        <form id="projectModifyForm" class="mx-auto max-w-lg" @submit.prevent="onSubmit">
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Project Name" name="name" />
              <UiVeeInput label="Model FY" name="modelFY" type="number" />
              <UiVeeInput label="Model Series" name="modelSeries" />
              <UiVeeInput label="Model Name" name="modelName" />
            </fieldset>
          </UiCardContent>
        </form>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-between">
          <UiButton variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
          <UiButton type="submit" form="projectModifyForm">
            Modify
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </div>
</template>
