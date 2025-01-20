<script lang="ts" setup>
import type { Setting } from "@prisma/client"
import { zodSettingSchema } from "~~/shared/schema/setting"

const { data: setting } = await useFetch<Setting>(`/api/settings/${useRoute().params.settingId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
  initialValues: {
    ...setting.value,
  },
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Setting>(`/api/settings/${useRoute().params.settingId}/`, {
      method: "PATCH",
      body: data,
    }),
    {
      loading: "MOdify Settings ...",
      success: () => "Settings information has been updated.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/settings")
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Modify Evaluation Setting">
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
