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
    }).then((response) => {
      return new Promise((resolve) => {
        setTimeout(() => {
          navigateTo("/settings")
          resolve(response)
        }, 1000) // 1-second delay
      })
    }),
    {
      loading: "Creating Settings ...",
      success: () => "Settings has been added into database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
})
const nameModel = ref("")
const nameDebounce = useDebounce(nameModel, 500)
const checkHintUrl = computed(() => `/api/settings/checkname?name=${nameDebounce.value}`)
const { data: nameHint } = useFetch<string>(checkHintUrl)
</script>

<template>
  <form @submit="onSubmit">
    <UiCard title="Create setting">
      <template #content>
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput v-model="nameModel" label="Setting Name" name="name" :hint="nameHint" />
            <UiVeeTextarea label="Setting Value" name="value" :row="3" hint="Separate each value into new line." />
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
