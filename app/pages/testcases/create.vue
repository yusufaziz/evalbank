<script lang="ts" setup>
import type { Checkitem, Testcase } from "@prisma/client"
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

// Create a reactive array for checkitems
const checkitems = ref<Checkitem[]>([])

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Testcase>("/api/testcases/", {
      method: "PUT",
      body: { ...data, checkitems: checkitems.value },
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
