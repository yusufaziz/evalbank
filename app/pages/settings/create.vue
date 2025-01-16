<script lang="ts" setup>
import { zodSettingSchema } from "~~/shared/schema/setting"

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch("/api/settings/", {
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
  <div class="flex items-center justify-center">
    <form class="mx-auto max-w-md" @submit="onSubmit">
      <UiCard class="w-[360px] max-w-sm" title="Create setting" description="Create new setting.">
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Setting Name" name="name" />
              <UiVeeInput label="Setting Value" name="value" />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton type="reset" variant="outline">
              Cancel
            </UiButton>
            <UiButton type="submit">
              Create
            </UiButton>
          </UiCardFooter>
        </template>
      </UiCard>
    </form>
  </div>
</template>
