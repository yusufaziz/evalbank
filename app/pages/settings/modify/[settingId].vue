<script lang="ts" setup>
import type { Setting } from "@prisma/client"
import consola from "consola"
import { zodSettingSchema } from "~~/shared/schema/setting"

const { data: setting } = useFetch<Setting>(`/api/settings/${useRoute().params.settingId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
})

const onSubmit = handleSubmit(async (data) => {
  consola.log(data)
  const promise = () => new Promise(resolve => setTimeout(resolve, 3000))
  useSonner.promise(promise, {
    loading: "Sending information to our servers...",
    success: () => "We updated your information.",
    error: () => "Error! Your information could not be sent to our servers!",
  })
})
</script>

<template>
  <div class="flex items-center justify-center">
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
            <UiButton type="reset" variant="outline">
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
