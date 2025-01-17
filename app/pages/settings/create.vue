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
  <div class="flex items-center">
    <UiCard class="w-[360px] max-w-sm" title="Create setting" description="Create new setting.">
      <template #content>
        <form id="formCreateSetting" class="mx-auto max-w-md" @submit="onSubmit">
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Setting Name" name="name" />
              <UiVeeInput label="Setting Value" name="value" />
            </fieldset>
          </UiCardContent>
        </form>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-between">
          <UiButton variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
          <UiButton type="submit" form="formCreateSetting">
            Create
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </div>
</template>
