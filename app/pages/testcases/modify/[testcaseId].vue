<script lang="ts" setup>
import type { Testcase } from "@prisma/client"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

const { data: testcase } = await useFetch<Testcase>(`/api/testcases/${useRoute().params.testcaseId}`)
const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
  initialValues: {
    ...testcase.value,
  },
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Testcase>(`/api/testcases/${useRoute().params.testcaseId}/`, {
      method: "PATCH",
      body: { ...data, modifier: "modifier-id" },
    }),
    {
      loading: "Modifying Testcase ...",
      success: () => "Testcase information has been updated.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/testcases")
})
</script>

<template>
  <div class="flex items-center">
    <UiCard class="w-[800px]" title="Modify Testcase">
      <template #content>
        <form id="formModifyTestcase" class="mx-auto" @submit="onSubmit">
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Name" name="name" />
              <UiVeeTextarea label="Procedures" name="procedures" :rows="10" hint="Separate each step of procedure with new line." />
            </fieldset>
          </UiCardContent>
        </form>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-between">
          <UiButton type="reset" variant="outline" @click="() => { useRouter().back() }">
            Cancel
          </UiButton>
          <UiButton type="submit" form="formModifyTestcase">
            Modify
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
    <div>
      <pre>{{ values }}</pre>
    </div>
  </div>
</template>
