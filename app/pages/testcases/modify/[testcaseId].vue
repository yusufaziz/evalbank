<script lang="ts" setup>
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { ITestcase } from "~~/shared/interface/testcase"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

const testcaseId = useRoute().params.testcaseId

// Fetch the existing testcase
const { data: testcase } = await useFetch<ITestcase>(
  `/api/testcases/${testcaseId}`,
)

// Create a reactive array for checkitems
const checkitems = ref<ICheckitem[]>(testcase.value?.checkitems || [])

// Initialize the form
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
  initialValues: {
    ...testcase.value, // Initialize form with existing testcase data
  },
})

// Handle form submission
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<ITestcase>(`/api/testcases/${testcaseId}/`, {
      method: "PATCH",
      body: { ...data, checkitems: checkitems.value }, // Include checkitems in the payload
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo("/testcases")
          resolve(response)
        }, 1000) // 1-second delay
      })
    }),
    {
      loading: "Modifying Testcase ...",
      success: () => "Testcase information has been updated.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Modify Testcase">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Group" name="group" />
            <UiVeeInput label="Name" name="name" />
            <UiVeeTextarea
              label="Procedures"
              name="procedures"
              :rows="5"
              hint="Separate each step of procedure with new line."
            />
            <UiDivider label="Checkitems" />
            <TAddCheckitem v-model="checkitems" />
          </fieldset>
        </UiCardContent>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-start gap-5">
          <UiButton type="submit">
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
