<script lang="ts" setup>
import type { Project } from "@prisma/client"
import type { IGroupedSettings } from "~~/shared/interface/settings"
import { zodProjectSchema } from "~~/shared/schema/project"

const { data: project } = await useFetch(`/api/projects/${useRoute().params.projectId}/`)
const { data: settings } = useFetch<IGroupedSettings[]>("/api/settings?group=name&with=id")
const selectedSettings = ref<{ setting: string, additionalData: string[] }[]>([])
const transformedSettings = project?.value.settings.reduce((acc, curr) => {
  const existing = acc.find(item => item.setting === curr.name)
  if (existing) {
    existing.additionalData.push(curr.id)
  }
  else {
    acc.push({ setting: curr.name, additionalData: [curr.id] })
  }
  return acc
}, [] as { setting: string, additionalData: string[] }[])

selectedSettings.value = transformedSettings
const showAdditional = ref()
const { handleSubmit, isSubmitting } = useForm({
  validationSchema: toTypedSchema(zodProjectSchema),
  initialValues: {
    ...project.value,
  },
})
const onSubmit = handleSubmit(async (data) => {
  useSonner.promise(
    $fetch<Project>(`/api/projects/${useRoute().params.projectId}`, {
      method: "patch",
      body: { ...data, settingIds: selectedSettings.value.flatMap(item => item.additionalData) },
    }),
    {
      loading: "Modifying Project ...",
      success: () => "Project information has been modified.",
      error: () => "Error! Something went wrong during modifying data!",
    },
  )
  navigateTo("/projects")
})
</script>

<template>
  <UiCard
    class="w-[800px]"
    title="Modify Project"
  >
    <template #content>
      <form id="projectModifyForm" class="mx-auto" @submit.prevent="onSubmit">
        <UiCardContent>
          <fieldset :disabled="isSubmitting" class="space-y-5">
            <UiVeeInput label="Project Name" name="name" />
            <div class="flex flex-row gap-2">
              <UiVeeInput label="Model FY" name="modelFY" type="number" />
              <UiVeeInput label="Model Series" name="modelSeries" />
              <UiVeeInput label="Model Name" name="modelName" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1">
                Required Settings
              </label>
              <UiScrollArea class="h-[calc(100vh-300px)] w-full rounded-md border p-4">
                <div v-for="(item, index) in selectedSettings" :key="index" class="mb-4">
                  <div class="flex items-center gap-2">
                    <UiSelect v-model="item.setting">
                      <UiSelectTrigger placeholder="Select an Setting" />
                      <UiSelectContent>
                        <UiSelectItem v-for="(setting, i) in settings" :key="i" :value="setting.name" :text="setting.name" />
                      </UiSelectContent>
                    </UiSelect>
                    <UiButton
                      :variant="(item.additionalData.length > 0 ? 'default' : 'ghost')"
                      size="icon"
                      @click="(showAdditional ? showAdditional = null : showAdditional = item.setting)"
                    >
                      <Icon class="size-4" name="lucide:list-collapse" />
                    </UiButton>
                    <UiButton
                      variant="destructive"
                      size="icon"
                      @click="selectedSettings.splice(index, 1)"
                    >
                      <Icon class="size-4" name="lucide:trash" />
                    </UiButton>
                  </div>
                  <div v-if="showAdditional && showAdditional === item.setting" class="mt-2">
                    <UiListbox v-model="item.additionalData" multiple>
                      <UiListboxContent>
                        <UiListboxItem v-for="(p, i) in settings?.find(f => f.name === item.setting).value" :key="i" :value="(p.split('#')[0] || '').toString()">
                          <span>{{ (p.split('#')[1] || '').toString() }}</span>
                        </UiListboxItem>
                      </UiListboxContent>
                    </UiListbox>
                  </div>
                </div>
                <UiButton
                  variant="outline"
                  size="sm"
                  class="text-sm"
                  @click="selectedSettings.push({ setting: '', additionalData: [] })"
                >
                  Add Other Setting
                </UiButton>
              </UiScrollArea>
            </div>
          </fieldset>
        </UiCardContent>
      </form>
    </template>
    <template #footer>
      <UiCardFooter class="flex justify-between">
        <UiButton variant="outline" @click="useRouter().back()">
          Cancel
        </UiButton>
        <UiButton type="submit" form="projectModifyForm">
          Modify
        </UiButton>
      </UiCardFooter>
    </template>
  </UiCard>
</template>
