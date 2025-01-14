<template>
  <UiSidebarProvider v-slot="{ isMobile, state }">
    <!-- App Sidebar -->
    <UiSidebar collapsible="icon">
      <SidebarProjectSwitcher :state="state" :isMobile="isMobile" />
      <SidebarContent :state="state" :isMobile="isMobile" />
      <UiSidebarRail />
      <SidebarFooter :state="state" :isMobile="isMobile" />
    </UiSidebar>
    <!-- Sidebar main content -->
    <UiSidebarInset>
      <!-- Navbar -->
      <UiNavbar sticky class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <UiSidebarTrigger class="-ml-1" />
        <UiSeparator orientation="vertical" class="mr-2 h-4" />
        <UiBreadcrumbs :items="breadcrumbsItems" />
      </UiNavbar>
      <div class="grid auto-rows-min gap-4 p-4 md:grid-cols-3">
        <slot />
      </div>
    </UiSidebarInset>
  </UiSidebarProvider>
</template>

<script lang="ts" setup>
  import SidebarContent from "~/components/testpoint/sidebarContent.vue";
  import SidebarFooter from "~/components/testpoint/sidebarFooter.vue";
  import SidebarProjectSwitcher from "~/components/testpoint/sidebarProjectSwitcher.vue";

  const breadcrumbsItems = useBreadcrumbItems();
  const { data: projects } = useFetch("/api/projects");

  // This is sample data.
  const data = {
    teams: [
      {
        name: "Acme Inc",
        logo: "lucide:gallery-vertical-end",
        plan: "Enterprise",
      },
      {
        name: "Acme Corp.",
        logo: "lucide:audio-waveform",
        plan: "Startup",
      },
      {
        name: "Evil Corp.",
        logo: "lucide:command",
        plan: "Free",
      },
    ],
  };
  const activeTeam = ref(data.teams[1]);
  useSeoMeta({ title: "Evalbank: Easier evaluation." });
</script>
