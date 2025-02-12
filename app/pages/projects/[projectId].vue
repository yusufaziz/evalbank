<script lang="ts" setup>
import type { IChartData } from "~~/shared/interface/chart"
import type { IProjectInfo, IProjectTestcase } from "~~/shared/interface/project"
import type { ITestcase } from "~~/shared/interface/testcase"
import consola from "consola"

/**
 * @brief Component for displaying project details and associated test cases.
 * @details This component provides tabs for Dashboard, Evaluation, and Project Settings.
 */
const route = useRoute()
const projectId = computed(() => route.params.projectId)

// Search functionality
const searchInput = ref("")
const search = useDebounce(searchInput, 500)
const query = computed(() => ({
  search: search.value,
}))

// Fetch data for the project and its test cases
const { data: projectTestcase } = useFetch<IProjectTestcase>(
  `/api/projects/testcases/${projectId.value}`,
)
const { data: projectInfo } = useFetch<IProjectInfo>(`/api/projects/${projectId.value}`)
const { data: testcases } = useFetch<ITestcase[]>(`/api/testcases?projectId=${projectId.value}`, { query })

useEventBus("refresh:projects").on((e) => {
  if (e === "all") {
    refreshNuxtData()
  }
})

const projectSetting = computed(() => {
  return projectInfo.value?.settings
})

/**
 * @brief Tabs configuration for the project page.
 */
const tabs = [
  {
    title: "Dashboard",
    icon: "lucide:home",
  },
  {
    title: "Evaluation",
    icon: "lucide:panels-top-left",
    badge: projectTestcase.value?.totalCount,
  },
  {
    title: "Project Settings",
    icon: "lucide:settings",
  },
]
async function generatePdf() {
  useSonner.promise(
    $fetch(`/api/projects/report/${projectId.value}`, {
      responseType: "blob", // Important for handling binary data
    }).then((pdfBlob: any) => {
      // Create a download link for the PDF
      const url = window.URL.createObjectURL(new Blob([pdfBlob]))
      const link = document.createElement("a")
      link.href = url
      link.setAttribute("download", `Report Project FY${projectInfo.value?.modelFY} ${projectInfo.value?.modelSeries}-${projectInfo.value?.modelName} ${projectInfo.value?.name}.pdf`)
      document.body.appendChild(link)
      link.click()

      // Clean up
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }),
    {
      loading: "Generating report...",
      success: () => "Report has been created.",
      error: () => "Error! Something went wrong during preparing report!",
    },
  )
}
</script>

<template>
  <UiSheet should-scale-background>
    <UiTabs default-value="Dashboard">
      <div class="flex gap-2">
        <UiTabsList>
          <UiTabsTrigger
            v-for="t in tabs"
            :key="t.title"
            :value="t.title"
            class="flex items-center gap-2"
          >
            <Icon
              :name="t.icon"
              class="-ms-0.5 me-1.5 size-4 shrink-0 opacity-60"
            />
            {{ t.title }}
            <UiBadge
              v-if="t.badge"
              class="px-2"
            >
              {{ t.badge }}
            </UiBadge>
          </UiTabsTrigger>
        </UiTabsList>
        <UiButton
          variant="outline"
          @click="navigateTo(`/projects/modify/${projectId}`)"
        >
          <Icon class="size-4" name="lucide:pencil" /> Modify
        </UiButton>
        <UiButton
          v-if="useRuntimeConfig().public.SUPPORT_REDMINE"
          variant="outline"
        >
          <Icon class="size-4" name="lucide:refresh-ccw" /> SOT
        </UiButton>
        <UiButton
          v-if="useRuntimeConfig().public.SUPPORT_EXPORT_PDF"
          variant="outline"
          @click="generatePdf()"
        >
          <Icon class="size-4" name="lucide:save" /> PDF
        </UiButton>
        <UiSheetTrigger as-child>
          <UiButton>
            <Icon class="size-4" name="lucide:file-symlink" /> Connect Testcase
          </UiButton>
        </UiSheetTrigger>
      </div>

      <!-- Dashboard Tab -->
      <UiTabsContent value="Dashboard">
        <div v-if="useRuntimeConfig().public.SUPPORT_REDMINE">
          <Icon class="size-3" name="lucide:link" /> Linked to {{ useRuntimeConfig().public.REDMINE_LABEL }} with project name : {{ projectInfo?.redmineProject }}
        </div>
        <div v-if="projectTestcase">
          <UiChartBar
            :data="projectTestcase?.chart?.data || []"
            index="name"
            :categories="(projectTestcase?.chart?.categories as (keyof IChartData)[]) || []"
            :rounded-corners="4"
            type="stacked"
            :colors="projectTestcase?.chart?.colors || []"
          />
        </div>
      </UiTabsContent>

      <!-- Evaluation Tab -->
      <UiTabsContent value="Evaluation">
        <UiScrollArea class="h-[calc(100vh-50px)] w-lg p-1">
          <div
            v-for="(item, index) in projectTestcase?.testcases"
            :key="index" class="mb-4"
          >
            <TTestcaseView
              :id="item.testcaseId || ''"
              :unsync-btn="true"
              @need-refresh="async () => { await refreshNuxtData() }"
            />
          </div>
        </UiScrollArea>
      </UiTabsContent>

      <!-- Project Settings Tab -->
      <UiTabsContent value="Project Settings">
        <UiScrollArea class="h-[calc(90vh-50px)] w-lg p-1">
          <TSettingView
            :show-control="true"
            :show-sync-project-id="projectInfo?.id"
            :settings="projectSetting || []"
          />
        </UiScrollArea>
      </UiTabsContent>
    </UiTabs>

    <!-- Sheet Content for Adding Testcases -->
    <UiSheetContent
      class="sm:max-w-none md:w-[650px]"
      side="right"
      title="Testcases List"
      description="Select the testcases into projects"
    >
      <template #content>
        <UiScrollArea class="h-[calc(100vh-100px)] w-lg p-1 border">
          <UiInput
            v-model="searchInput"
            placeholder="Search"
            class="max-w-md m-1"
          />
          <div
            v-for="(item, index) in testcases"
            :key="index" class="mb-4"
          >
            <TTestcaseView
              :id="item.id"
              :sync-btn="true"
              @need-refresh="async () => { refreshNuxtData() }"
            />
          </div>
        </UiScrollArea>
      </template>
    </UiSheetContent>
  </UiSheet>
</template>
