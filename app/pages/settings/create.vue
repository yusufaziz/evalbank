<script lang="ts" setup>
import type { Setting } from "@prisma/client"
import { toTypedSchema } from "@vee-validate/zod"
import { useForm } from "vee-validate"

import { zodSettingSchema } from "~~/shared/schema/setting"

/**
 * @brief Component for creating a new setting.
 * @details This component provides a form for entering setting details and checking name availability.
 */
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodSettingSchema),
})

// Name input and debounce for hint
const nameModel = ref("")
const nameDebounce = useDebounce(nameModel, 500)
const checkHintUrl = computed(() => `/api/settings/checkname?name=${nameDebounce.value}`)
const { data: nameHint } = useFetch<string>(checkHintUrl)

onMounted(() => {
  const name = useRoute().query.name?.toString()
  if (name) {
    nameModel.value = name
  }
})

/**
 * @brief Handles form submission to create a new setting.
 * @param data - The validated form data.
 */
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Setting>("/api/settings/", {
      method: "PUT",
      body: data,
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo("/settings")
          resolve(response)
        }, 1000) // Simulate a 1-second delay
      })
    }),
    {
      loading: "Creating Settings ...",
      success: () => "Settings have been added to the database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
})
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Create Setting">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput
              v-model="nameModel"
              label="Setting Name"
              name="name"
              :hint="nameHint"
            />
            <UiVeeTextarea
              label="Setting Value"
              name="value"
              :row="3"
              hint="Separate each value into a new line."
            />
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
