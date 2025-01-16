<script lang="ts" setup>
import type { Testcase } from "@prisma/client"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

const { data: testcase } = useFetch<Testcase>(`/api/testcases/${useRoute().params.testcaseId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch(`/api/testcases/{useRoute().params.testcaseId}/`, {
      method: "PATCH",
      body: data,
    }),
    {
      loading: "Modifying Testcase ...",
      success: () => "Testcase information has been updated.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/testcase")
})
</script>

<template>
  <div class="flex items-center">
    <form class="mx-auto" @submit="onSubmit">
      <UiCard
        class="w-[800px]"
        title="Modify Testcase"
        description="Modify the Testcase information."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Name" name="name" :model-value="testcase?.name" />
              <UiVeeTextarea label="Procedures" name="procedures" :model-value="testcase?.procedures" :rows="10" hint="Separate each step of procedure with new line." />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton type="reset" variant="outline" @click="() => { useRouter().back() }">
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
