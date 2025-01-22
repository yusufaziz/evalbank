<script lang="ts" setup>
const { data: project } = useFetch(`/api/projects/details/${useRoute().params.projectId}`)
const { data: testcases } = useFetch(`/api/testcases?projectId=${useRoute().params.projectId}`)
// Computed property to calculate total evaluations
const totalEvaluations = computed(() => {
  if (!project.value || !project.value || !project.value.testcases) {
    return 0
  }

  // Traverse the nested structure and sum evaluations
  return project.value.testcases.reduce((totalTestcases, testcase) => {
    return (
      totalTestcases
      + testcase.checkitems.reduce((totalCheckitems, checkitem) => {
        return totalCheckitems + (checkitem.evaluations ? checkitem.evaluations.length : 0)
      }, 0)
    )
  }, 0)
})

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
    badge: totalEvaluations,
  },
]
</script>

<template>
  <UiSheet should-scale-background>
    <UiTabs default-value="Evaluations">
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
        Total Evaluation : {{ totalEvaluations }}
      </UiTabsContent>
      <UiTabsContent value="Evaluation">
        <UiScrollArea class="h-[calc(100vh-50px)] w-lg p-1">
          <div v-for="(item, index) in project?.testcases" :key="index" class="mb-4">
            <TestpointPartTestcaseProcedureColapsibles
              :id="item.id"
              :name="item.name"
              :checkitems="item.checkitems"
              :procedures="item.procedures"
              :unsync-btn="true"
              @need-refresh="async () => { await refreshNuxtData() }"
            />
          </div>
        </UiScrollArea>
      </UiTabsContent>
      <UiTabsContent value="Project Information">
        <pre>{{ project }}</pre>
      </UiTabsContent>
    </UiTabs>

    <UiSheetContent
      class="sm:max-w-none md:w-[650px]"
      side="right"
    >
      <template #content>
        <UiScrollArea class="h-[calc(100vh-50px)] w-lg p-1">
          <div v-for="(item, index) in testcases" :key="index" class="mb-4">
            <TestpointPartTestcaseProcedureColapsibles
              :id="item.id"
              :name="item.name"
              :checkitems="item.checkitems"
              :procedures="item.procedures"
              :sync-btn="true"
              @need-refresh="async () => { await refreshNuxtData() }"
            />
          </div>
        </UiScrollArea>
      </template>
    </UiSheetContent>
  </UiSheet>
</template>
