<script lang="ts" setup>
import type { Checkitem } from "@prisma/client"
import { zodCheckitemSchema } from "~~/shared/schema/checkitem"

const { data: checkitem } = useFetch<Checkitem>(`/api/checkitems/${useRoute().params.checkitemId}`)
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodCheckitemSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Checkitem>(`/api/checkitems/{useRoute().params.checkitemId}/`, {
      method: "PATCH",
      body: data,
    }),
    {
      loading: "Modifying Checkitem ...",
      success: () => "Checkitem information has been updated.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/checkitems")
})
</script>

<template>
  <div class="flex items-center">
    <form class="mx-auto" @submit="onSubmit">
      <UiCard
        class="w-[800px]"
        title="Modify Testcase"
        description="Modify the Testcase information."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Module" name="module" :model-value="checkitem?.module" />
              <UiVeeInput label="Expected Target" name="expectedTarget" :model-value="checkitem?.expectedTarget" />
              <UiVeeInput label="Setting Names" name="settingsNames" :model-value="checkitem?.settingsNames" />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton type="reset" variant="outline" @click="() => { useRouter().back() }">
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
