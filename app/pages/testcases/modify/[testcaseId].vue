<script lang="ts" setup>
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { ITestcase } from "~~/shared/interface/testcase"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

/**
 * @brief Component for modifying an existing testcase.
 * @details This component provides a form for updating testcase details and associated checkitems.
 */
const testcaseId = useRoute().params.testcaseId

// Fetch the existing testcase
const { data: testcase } = await useFetch<ITestcase>(`/api/testcases/${testcaseId}`)

// Create a reactive array for checkitems
const checkitems = ref<ICheckitem[]>(testcase.value?.checkitems || [])

// Form setup with validation
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
  initialValues: {
    ...testcase.value, // Initialize form with existing testcase data
  },
})

/**
 * @brief Handles form submission to modify an existing testcase.
 * @param data - The validated form data.
 */
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
        }, 1000) // Simulate a 1-second delay
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
              hint="Separate each step of procedure with a new line."
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
