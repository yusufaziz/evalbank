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
  <div class="flex items-center">
    <UiCard class="w-[360px] max-w-sm" title="Modify Evaluation Setting" description="Modify the Evaluation Setting information.">
      <template #content>
        <form id="formModifySetting" class="mx-auto max-w-md" @submit.prevent="onSubmit">
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Setting Name" name="name" :model-value="setting?.name" />
            </fieldset>
          </UiCardContent>
        </form>
      </template>
      <template #footer>
        <UiCardFooter class="flex justify-between">
          <UiButton variant="outline" @click="useRouter().back()">
            Cancel
          </UiButton>
          <UiButton type="submit" form="formModifySetting">
            Modify
          </UiButton>
        </UiCardFooter>
      </template>
    </UiCard>
  </div>
</template>
