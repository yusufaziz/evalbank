<script lang="ts" setup>
import type { Checkitem, Testcase } from "@prisma/client"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

/**
 * @brief Component for creating a new testcase.
 * @details This component provides a form for entering testcase details and associated checkitems.
 */
const checkitems = ref<Checkitem[]>([])

// Form setup with validation
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
})

/**
 * @brief Handles form submission to create a new testcase.
 * @param data - The validated form data.
 */
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Testcase>("/api/testcases/", {
      method: "PUT",
      body: { ...data, checkitems: checkitems.value },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo("/testcases")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Creating Testcase ...",
      success: () => "Testcase has been successfully added to the database.",
      error: () => "Error! Your information could not be sent to our servers. Please try again.",
    },
  )
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Create Testcase">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Group" name="group" />
            <UiVeeInput label="Name" name="name" />
            <UiVeeTextarea
              label="Procedures"
              name="procedures"
              :rows="3"
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
            Create
          </UiButton>
          <UiButton variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </form>
</template>
