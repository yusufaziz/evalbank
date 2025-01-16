<script lang="ts" setup>
import type { Setting } from "@prisma/client"
import { zodSettingSchema } from "~~/shared/schema/setting"

const { data: setting } = useFetch<Setting>(`/api/settings/${useRoute().params.settingId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch(`/api/settings/${useRoute().params.settingId}/`, {
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
    <form class="mx-auto max-w-md" @submit="onSubmit">
      <UiCard
        class="w-[360px] max-w-sm"
        title="Modify Evaluation Setting"
        description="Modify the Evaluation Setting information."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Setting Name" name="name" :model-value="setting?.name" />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton variant="outline" @click="useRouter().back()">
              Cancel
            </UiButton>
            <UiButton type="submit">
              Modify
            </UiButton>
          </UiCardFooter>
        </template>
      </UiCard>
    </form>
  </div>
</template>
