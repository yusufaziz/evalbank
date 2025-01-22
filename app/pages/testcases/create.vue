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
      success: () => "Testcase has been successfully added to the database.",
      error: () => "Error! Your information could not be sent to our servers. Please try again.",
    },
  )
  navigateTo("/testcases")
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Create testcase">
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
