<script lang="ts" setup>
/**
 * @brief Default layout for the application.
 * @details This layout includes a sidebar, navbar, and main content area.
 */
const breadcrumbsItems = useBreadcrumbItems()

// Set SEO metadata dynamically
useSeoMeta({
  title: `${useRuntimeConfig().public.APP_TITLE}: ${useRuntimeConfig().public.APP_DESCRIPTION}`,
})
</script>

<template>
  <UiSidebarProvider v-slot="{ isMobile, state }">
    <!-- App Sidebar -->
    <UiSidebar collapsible="icon">
      <TSidebarProjectInfo
        v-if="useRoute().name === 'projects-projectId'"
        :state="state"
        :is-mobile="isMobile"
      />
      <TSidebarContent :state="state" :is-mobile="isMobile" />
      <UiSidebarRail />
      <TSidebarFooter :state="state" :is-mobile="isMobile" />
    </UiSidebar>

    <!-- Sidebar Main Content -->
    <UiSidebarInset>
      <!-- Navbar -->
      <UiNavbar sticky class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <UiSidebarTrigger class="-ml-1" />
        <UiSeparator orientation="vertical" class="mr-2 h-4" />
        <UiBreadcrumbs :items="breadcrumbsItems" />
      </UiNavbar>

      <!-- Main Content -->
      <div class="p-3">
        <slot />
      </div>
    </UiSidebarInset>
  </UiSidebarProvider>
</template>
