<script lang="ts" setup>
import type { Project } from "@prisma/client"
import { zodProjectSchema } from "~~/shared/schema/project"

const { data: project } = useFetch<Project>(`/api/projects/${useRoute().params.projectId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
})
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    useFetch(`/api/projects/${useRoute().params.projectId}`, {
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
    <form class="mx-auto max-w-md" @submit="onSubmit">
      <UiCard
        class="w-[360px] max-w-sm"
        title="Modify Project"
        description="Modify the Project information."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Project Name" name="name" :model-value="project?.name" />
              <UiVeeInput
                label="Model FY"
                name="modelFY"
                type="number"
                :model-value="project?.modelFY.toString()"
              />
              <UiVeeInput
                label="Model Series"
                name="modelSeries"
                :model-value="project?.modelSeries"
              />
              <UiVeeInput label="Model Name" name="modelName" :model-value="project?.modelName" />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton variant="outline" @click="useRouter().back()">
              Cancel
            </UiButton>
            <UiButton type="submit">
              Modify
            </UiButton>
          </UiCardFooter>
        </template>
      </UiCard>
    </form>
  </div>
</template>
