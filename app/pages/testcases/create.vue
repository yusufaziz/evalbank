<script lang="ts" setup>
import type { Checkitem, Testcase } from "@prisma/client"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

// Create a reactive array for checkitems
const checkitems = ref<Checkitem[]>([])

const { handleSubmit, isSubmitting, values } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
  initialValues: {
    checkitems: [], // Initialize checkitems as an empty array
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

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Testcase>("/api/testcases/", {
      method: "PUT",
      body: data,
    }),
    {
      loading: "Creating Testcase ...",
      success: () => "Testcase has been added into database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/testcases")
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard class="w-[600px]" title="Create testcase">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Name" name="name" />
            <UiVeeTextarea
              label="Procedures"
              name="procedures"
              :rows="3"
              hint="Separate each step of procedure with new line."
            />
            <UiDivider label="Checkitems" />
            <TestpointPartFormAddCheckitem v-model="checkitems" />
          </fieldset>
        </UiCardContent>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-between">
          <UiButton type="submit">
            Create
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </form>
</template>
