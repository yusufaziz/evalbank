<script lang="ts" setup>
import SidebarContent from "~/components/testpoint/sidebarContent.vue"
import SidebarFooter from "~/components/testpoint/sidebarFooter.vue"
import SidebarProjectSwitcher from "~/components/testpoint/sidebarProjectSwitcher.vue"

const breadcrumbsItems = useBreadcrumbItems()
useSeoMeta({ title: "Evalbank: Easier evaluation." })
</script>

<template>
  <UiSidebarProvider v-slot="{ isMobile, state }">
    <!-- App Sidebar -->
    <UiSidebar collapsible="icon">
      <SidebarProjectSwitcher :state="state" :is-mobile="isMobile" />
      <SidebarContent :state="state" :is-mobile="isMobile" />
      <UiSidebarRail />
      <SidebarFooter :state="state" :is-mobile="isMobile" />
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
