<script lang="ts" setup>
import type { TestCase } from "@prisma/client"
import consola from "consola"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

const { data: testcase } = useFetch<TestCase>(`/api/testcases/${useRoute().params.testcaseId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
})

const onSubmit = handleSubmit(async (data) => {
  consola.log(data)
  const promise = () => new Promise(resolve => setTimeout(resolve, 3000))
  useSonner.promise(promise, {
    loading: "Sending information to our servers...",
    success: () => "We updated your information.",
    error: () => "Error! Your information could not be sent to our servers!",
  })
})
</script>

<template>
  <div class="flex items-center justify-center">
    <form class="mx-auto max-w-md" @submit="onSubmit">
      <UiCard
        class="w-[360px] max-w-sm"
        title="Modify Project"
        description="Modify the Project information."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Project Name" name="name" :model-value="testcase?.name" />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton type="reset" variant="outline">
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
