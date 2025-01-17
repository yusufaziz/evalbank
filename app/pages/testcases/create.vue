<script lang="ts" setup>
import { zodTestcaseSchema } from "~~/shared/schema/testcase"

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodTestcaseSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch("/api/testcases/", {
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
  <div class="flex items-center">
      <UiCard class="w-[800px]" title="Create testcase" description="Create a new testcase." >
        <template #content>
          <form id="formCreateTestcase" class="mx-auto max-w-lg" @submit.prevent="onSubmit">
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
            <UiButton type="submit" form="formCreateTestcase">
              Create
            </UiButton>
          </UiCardFooter>
        </template>
      </UiCard>
    
  </div>
</template>
