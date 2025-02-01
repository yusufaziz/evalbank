<script lang="ts" setup>
import type { IProjectInfo, IProjectTestcase } from "~~/shared/interface/project"

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
const { data: testcases } = useFetch(`/api/testcases?projectId=${projectId.value}`, { query })

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
</script>

<template>
  <UiSheet should-scale-background>
    <UiTabs default-value="Dashboard">
      <div class="flex gap-5">
        <UiTabsList>
          <UiTabsTrigger
            v-for="t in tabs"
            :key="t.title"
            :value="t.title"
            class="flex items-center gap-2"
          >
            <Icon :name="t.icon" class="-ms-0.5 me-1.5 size-4 shrink-0 opacity-60" />
            {{ t.title }}
            <UiBadge v-if="t.badge" class="px-2">
              {{ t.badge }}
            </UiBadge>
          </UiTabsTrigger>
        </UiTabsList>
        <UiSheetTrigger as-child>
          <UiButton>Add Testcase to Project</UiButton>
        </UiSheetTrigger>
      </div>

      <!-- Dashboard Tab -->
      <UiTabsContent value="Dashboard">
        <div v-if="projectTestcase">
          <UiChartBar
            :data="projectTestcase?.chart?.data || []"
            index="name"
            :categories="projectTestcase?.chart?.categories || []"
            :rounded-corners="4"
            type="stacked"
            :colors="projectTestcase?.chart?.colors || []"
          />
        </div>
      </UiTabsContent>

      <!-- Evaluation Tab -->
      <UiTabsContent value="Evaluation">
        <UiScrollArea class="h-[calc(100vh-50px)] w-lg p-1">
          <div v-for="(item, index) in projectTestcase?.testcases" :key="index" class="mb-4">
            <TTestcaseView
              :id="item.testcaseId"
              :unsync-btn="true"
              @need-refresh="async () => { await refreshNuxtData() }"
            />
          </div>
        </UiScrollArea>
      </UiTabsContent>

      <!-- Project Settings Tab -->
      <UiTabsContent value="Project Settings">
        <TSettingView :settings="projectInfo?.settings || []" />
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
          <UiInput v-model="searchInput" placeholder="Search" class="max-w-md m-1" />
          <div v-for="(item, index) in testcases" :key="index" class="mb-4">
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
