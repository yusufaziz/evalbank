<script lang="ts" setup>
import type { Setting } from "@prisma/client"
import { zodSettingSchema } from "~~/shared/schema/setting"

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Setting>("/api/settings/", {
      method: "PUT",
      body: data,
    }),
    {
      loading: "Creating Settings ...",
      success: () => "Settings has been added into database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/settings")
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Create setting">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Setting Name" name="name" />
            <UiVeeInput label="Setting Value" name="value" />
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
