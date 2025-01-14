<template>
    <div class="flex items-center justify-center">
        <form class="mx-auto max-w-md" @submit="onSubmit">
        <UiCard
          class="w-[360px] max-w-sm"
          title="Modify Project"
          description="Modify the Project information."
        >
          <template #content>
            <UiCardContent>
              <fieldset :disabled="isSubmitting" class="space-y-5">
                  <UiVeeInput label="Project Name" name="name" :model-value="project?.name"  />
                  <UiVeeInput label="Model FY" name="modelFY" type="number" :model-value="project?.modelFY" />
                  <UiVeeInput label="Model Series" name="modelSeries" :model-value="project?.modelSeries" />
                  <UiVeeInput label="Model Name" name="modelName" :model-value="project?.modelName" />
                  
              </fieldset>
            </UiCardContent>
          </template>
          <template #footer>
            <UiCardFooter class="flex justify-between">
              <UiButton type="reset" variant="outline">Cancel</UiButton>
              <UiButton type="submit"> Modify </UiButton>
            </UiCardFooter>
          </template>
        </UiCard>
      </form>
    </div>
  </template>
    
    <script lang="ts" setup>
      import type { Project } from "@prisma/client";
        import { zodProjectSchema } from "~~/shared/schema/project";
        const {data: project} = useFetch<Project>(`/api/projects/${useRoute().params.projectId}`)

      
    
      const { handleSubmit, isSubmitting } = useForm({
        validationSchema: toTypedSchema(zodProjectSchema),
      });
    
      const onSubmit = handleSubmit(async (data) => {
        console.log(data)
        const promise = () => new Promise((resolve) => setTimeout(resolve, 3000));
        useSonner.promise(promise, {
          loading: "Sending information to our servers...",
          success: () => "We updated your information.",
          error: () => "Error! Your information could not be sent to our servers!",
        });
      });
    </script>
    