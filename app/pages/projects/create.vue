<script lang="ts" setup>
import type { Project } from "@prisma/client"
import consola from "consola"
import { zodProjectSchema } from "~~/shared/schema/project"

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
})

const onSubmit = handleSubmit(async (data) => {
  consola.log(data)
  await useSonner.promise(
    $fetch<Project>("/api/projects", {
      method: "PUT",
      body: { ...data, author: "dummy-author-id" },
    }),
    {
      loading: "Creating Project ...",
      success: () => "Project has been added into database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/projects")
})
</script>

<template>
  <div class="flex items-center">
    <UiCard
      class="w-[600px]"
      title="Create project"
      description="Create a new project."
    >
      <template #content>
        <form id="projectCreateForm" class="mx-auto max-w-lg" @submit.prevent="onSubmit">
          <UiCardContent>
            <fieldset>
              <UiVeeInput label="Project Name" name="name" />
              <UiVeeNumberField :min="20" :max="50" label="Model FY" name="modelFY">
                <UiNumberFieldInput placeholder="20" />
                <UiNumberFieldDecrement class="border-l" />
                <UiNumberFieldIncrement class="border-l" />
              </UiVeeNumberField>
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
          <UiButton type="submit" form="projectCreateForm">
            Create Project
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </div>
</template>
