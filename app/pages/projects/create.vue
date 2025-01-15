<script lang="ts" setup>
import { zodProjectSchema } from "~~/shared/schema/project"

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    useFetch("/api/projects", {
      method: "put",
      body: { ...data, author: "dummy-author-id" },
    }),
    {
      loading: "Creating Project ...",
      success: () => "Project has been added into database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
})
</script>

<template>
  <form class="mx-auto" @submit="onSubmit">
    <UiCard
      class="w-[360px] max-w-md"
      title="Create project"
      description="Create a new project."
    >
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting">
            <UiVeeInput label="Project Name" name="name" />
            <UiVeeInput label="Model FY" name="modelFY" type="number" />
            <UiVeeInput label="Model Series" name="modelSeries" />
            <UiVeeInput label="Model Name" name="modelName" />
          </fieldset>
        </UiCardContent>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-between">
          <UiButton type="reset" variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
          <UiButton type="submit">
            Create
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </form>
</template>
