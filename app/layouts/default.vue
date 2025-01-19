<script lang="ts" setup>
const breadcrumbsItems = useBreadcrumbItems()
const route = useRoute()
const routeParamsProjectId = computed(() => route.params.projectId)
useSeoMeta({ title: "Evalbank: Easier evaluation." })
</script>

<template>
  <UiSidebarProvider v-slot="{ isMobile, state }">
    <!-- App Sidebar -->
    <UiSidebar collapsible="icon">
      <TestpointSidebarProjectInfo v-if="!!routeParamsProjectId" :state="state" :is-mobile="isMobile" :project-id="routeParamsProjectId.toString()" />
      <TestpointSidebarContent :state="state" :is-mobile="isMobile" />
      <UiSidebarRail />
      <TestpointSidebarFooter :state="state" :is-mobile="isMobile" />
    </UiSidebar>
    <!-- Sidebar main content -->
    <UiSidebarInset>
      <!-- Navbar -->
      <UiNavbar sticky class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <UiSidebarTrigger class="-ml-1" />
        <UiSeparator orientation="vertical" class="mr-2 h-4" />
        <UiBreadcrumbs :items="breadcrumbsItems" />
      </UiNavbar>
      <div class="grid auto-rows-min gap-2 p-2 md:grid-cols-3">
        <slot />
      </div>
    </UiSidebarInset>
  </UiSidebarProvider>
</template>
