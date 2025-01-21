<script lang="ts" setup>
const { data: project } = useFetch(`/api/projects/details/${useRoute().params.projectId}`)
const { data: testcases } = useFetch("/api/testcases")
const tabs = [
  {
    title: "All",
    icon: "lucide:home",
    content: "This is the overview. Here you can see the overview of the project.",
  },
  {
    title: "Todo",
    icon: "lucide:panels-top-left",
    badge: 2,
    content: "These are the number of outstanding projects.",
  },
  {
    title: "NG",
    icon: "lucide:box",
    content: "You have a few new packages awaiting your approval.",
  },
]
</script>

<template>
  <UiSheet should-scale-background>
    <UiTabs default-value="All">
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
      <UiTabsContent value="All">
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
      <UiTabsContent value="Todo">
        Todo
      </UiTabsContent>
      <UiTabsContent value="NG">
        NG
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
