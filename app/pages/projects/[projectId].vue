<script lang="ts" setup>
const { data: projectTestcase } = useFetch(`/api/projects/testcases/${useRoute().params.projectId}`)
const { data: projectInfo } = useFetch(`/api/projects/${useRoute().params.projectId}`)
const { data: testcases } = useFetch(`/api/testcases?projectId=${useRoute().params.projectId}`)

const tabs = [
  {
    title: "Dashboard",
    icon: "lucide:home",
  },
  {
    title: "Project Information",
    icon: "lucide:box",
  },
  {
    title: "Evaluation",
    icon: "lucide:panels-top-left",
    badge: projectTestcase.value?.totalCount || "Calculating ...",
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
          <UiButton>Add Testcast to Project</UiButton>
        </UiSheetTrigger>
      </div>
      <UiTabsContent value="Dashboard">
        <pre>{{ projectTestcase }}</pre>
      </UiTabsContent>
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
      <UiTabsContent value="Project Information">
        <pre>{{ projectInfo }}</pre>
      </UiTabsContent>
    </UiTabs>

    <UiSheetContent
      class="sm:max-w-none md:w-[650px]"
      side="right"
    >
      <template #content>
        <UiScrollArea class="h-[calc(100vh-50px)] w-lg p-1">
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
