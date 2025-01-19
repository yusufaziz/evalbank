<script lang="ts" setup>
import type { Checkitem, Testcase } from "@prisma/client"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

// Fetch the existing testcase
const { data: testcase } = await useFetch<Testcase>(
  `/api/testcases/${useRoute().params.testcaseId}`,
)

// Create a reactive array for checkitems
const checkitems = ref<Checkitem[]>(testcase.value?.checkitems || [])

// Initialize the form
const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
  initialValues: {
    ...testcase.value, // Initialize form with existing testcase data
  },
})

// Sync the reactive array with the form's values
watch(
  checkitems,
  (newCheckitems) => {
    values.checkitems = newCheckitems // Update the form's values
  },
  { deep: true },
)

// Handle form submission
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Testcase>(`/api/testcases/${useRoute().params.testcaseId}/`, {
      method: "PATCH",
      body: { ...data, checkitems: checkitems.value, modifier: "modifier-id" }, // Include checkitems in the payload
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
  <form @submit="onSubmit">
    <UiCard class="w-[800px]" title="Modify Testcase">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Name" name="name" />
            <UiVeeTextarea
              label="Procedures"
              name="procedures"
              :rows="10"
              hint="Separate each step of procedure with new line."
            />
            <UiDivider label="Checkitems" />
            <TestpointPartFormAddCheckitem v-model="checkitems" />
          </fieldset>
        </UiCardContent>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-end">
          <UiButton type="submit">
            Modify
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </form>
</template>
