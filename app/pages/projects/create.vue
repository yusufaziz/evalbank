<template>
  <div class="flex items-center justify-center">
      <form class="mx-auto max-w-md" @submit="onSubmit">
      <UiCard
        class="w-[360px] max-w-sm"
        title="Create project"
        description="Create a new project."
      >
        <template #content>
          <UiCardContent>
            <fieldset :disabled="isSubmitting" class="space-y-5">
                <UiVeeInput label="Project Name" name="name" />
                <UiVeeInput label="Model FY" name="modelFY" type="number" />
                <UiVeeInput label="Model Name" name="modelName" />
                
            </fieldset>
          </UiCardContent>
        </template>
        <template #footer>
          <UiCardFooter class="flex justify-between">
            <UiButton type="reset" variant="outline">Cancel</UiButton>
            <UiButton type="submit"> Create </UiButton>
          </UiCardFooter>
        </template>
      </UiCard>
    </form>
  </div>
</template>
  
  <script lang="ts" setup>
import { zodProjectSchema } from '~~/shared/schema/project'; 
    const { handleSubmit, isSubmitting } = useForm({
      validationSchema: toTypedSchema(zodProjectSchema),
    });
  
    const onSubmit = handleSubmit(async (_) => {
      const promise = () => new Promise((resolve) => setTimeout(resolve, 3000));
      useSonner.promise(promise, {
        loading: "Sending information to our servers...",
        success: () => "We updated your information.",
        error: () => "Error! Your information could not be sent to our servers!",
      });
    });
  </script>
  