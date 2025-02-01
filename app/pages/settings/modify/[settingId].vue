<script lang="ts" setup>
import type { ISelectedSetting, Setting } from "@prisma/client"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"
import { zodSettingSchema } from "~~/shared/schema/setting"
import { populateSelectedSettings } from "~/utils/settings"

/**
 * @brief Component for modifying an existing setting.
 * @details This component provides a form for updating setting details and associated requirements.
 */
const requiring = ref<ISelectedSetting[]>([])

// Fetch the setting data
const { data: setting } = await useFetch<Setting>(
  `/api/settings/${useRoute().params.settingId}`,
  {
    onResponse: (response) => {
      requiring.value = populateSelectedSettings(response.response._data.requiring)
    },
  },
)

// Form setup with validation
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
  initialValues: {
    ...setting.value,
  },
})

/**
 * @brief Handles form submission to modify an existing setting.
 * @param data - The validated form data.
 */
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Setting>(`/api/settings/${useRoute().params.settingId}/`, {
      method: "PATCH",
      body: { ...data, requiring: requiring.value },
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo("/settings")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Modifying Settings ...",
      success: () => "Settings information has been updated.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
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
            <TSettingSelection v-model="requiring" />
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
