<script lang="ts" setup>
import type { Checkitem } from "@prisma/client"
import { zodCheckitemSchema } from "~~/shared/schema/checkitem"

const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodCheckitemSchema),
})

const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Checkitem>("/api/checkitems/", {
      method: "PUT",
      body: data,
    }),
    {
      loading: "Creating Checkitem ...",
      success: () => "Checkitem has been added into database.",
      error: () => "Error! Your information could not be sent to our servers!",
    },
  )
  navigateTo("/checkitems")
})
</script>

<template>
  <div class="flex items-center">
    <form class="mx-auto max-w-lg" @submit="onSubmit">
      <UiCard
        class="w-[800px]"
        title="Create checkitem"
        description="Create a new checkitem."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
              <UiVeeInput label="Module" name="module" />
              <UiVeeInput label="Expected Target" name="expectedTarget" />
              <UiVeeInput label="Setting Names" name="settingsNames" />
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton type="reset" variant="outline" @click="() => { useRouter().back() }">
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
