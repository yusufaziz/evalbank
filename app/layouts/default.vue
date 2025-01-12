<template>
  <UiSidebarProvider v-slot="{ isMobile, state }">
    <!-- App Sidebar -->
    <UiSidebar collapsible="icon">
      <ProjectSwitcher :state="state" :isMobile="isMobile" />
      <UiSidebarContent>
        <!-- Main -->
        <UiSidebarGroup>
          <UiSidebarGroupLabel label="Platform" />
          <UiSidebarMenu>
            <UiCollapsible
              v-for="(item, index) in data.navMain"
              :key="index"
              v-slot="{ open }"
              as-child
              :default-open="item.isActive"
            >
              <UiSidebarMenuItem>
                <UiCollapsibleTrigger as-child>
                  <UiSidebarMenuButton :tooltip="item.title">
                    <Icon mode="svg" :name="item.icon" />

                    <span>{{ item.title }}</span>
                    <Icon
                      mode="svg"
                      name="lucide:chevron-right"
                      class="ml-auto transition-transform duration-200"
                      :class="[open && 'rotate-90']"
                    />
                  </UiSidebarMenuButton>
                </UiCollapsibleTrigger>
                <UiCollapsibleContent>
                  <UiSidebarMenuSub>
                    <UiSidebarMenuSubItem v-for="subItem in item.items" :key="subItem.title">
                      <UiSidebarMenuSubButton as-child>
                        <NuxtLink :href="subItem.url">
                          <span>{{ subItem.title }}</span>
                        </NuxtLink>
                      </UiSidebarMenuSubButton>
                    </UiSidebarMenuSubItem>
                  </UiSidebarMenuSub>
                </UiCollapsibleContent>
              </UiSidebarMenuItem>
            </UiCollapsible>
          </UiSidebarMenu>
        </UiSidebarGroup>
        <!-- Projects -->
        <UiSidebarGroup class="group-data-[collapsible=icon]:hidden">
          <UiSidebarGroupLabel label="Projects" />
          <UiSidebarMenu>
            <UiSidebarMenuItem v-for="item in data.projects" :key="item.name">
              <UiSidebarMenuButton as-child>
                <NuxtLink :href="item.url">
                  <Icon mode="svg" :name="item.icon" />
                  <span>{{ item.name }}</span>
                </NuxtLink>
              </UiSidebarMenuButton>
              <UiDropdownMenu>
                <UiDropdownMenuTrigger as-child>
                  <UiSidebarMenuAction show-on-hover>
                    <Icon mode="svg" name="lucide:ellipsis-vertical" class="rotate-90" />
                    <span class="sr-only">More</span>
                  </UiSidebarMenuAction>
                </UiDropdownMenuTrigger>
                <UiDropdownMenuContent
                  class="w-48 rounded-lg"
                  :side="isMobile ? 'bottom' : 'right'"
                  :align="isMobile ? 'end' : 'start'"
                >
                  <UiDropdownMenuItem>
                    <Icon mode="svg" name="lucide:folder" class="text-muted-foreground" />
                    <span>View Project</span>
                  </UiDropdownMenuItem>
                  <UiDropdownMenuItem>
                    <Icon name="lucide:forward" class="text-muted-foreground" />
                    <span>Share Project</span>
                  </UiDropdownMenuItem>
                  <UiDropdownMenuSeparator />
                  <UiDropdownMenuItem>
                    <Icon name="lucide:trash-2" class="text-muted-foreground" />
                    <span>Delete Project</span>
                  </UiDropdownMenuItem>
                </UiDropdownMenuContent>
              </UiDropdownMenu>
            </UiSidebarMenuItem>

            <UiSidebarMenuItem>
              <UiSidebarMenuButton class="text-sidebar-foreground/70">
                <Icon
                  name="lucide:ellipsis-vertical"
                  class="rotate-90 text-sidebar-foreground/70"
                />
                <span>More</span>
              </UiSidebarMenuButton>
            </UiSidebarMenuItem>
          </UiSidebarMenu>
        </UiSidebarGroup>
      </UiSidebarContent>
      <UiSidebarRail />
      <!-- Footer-->
      <UiSidebarFooter>
        <UiSidebarMenu>
          <UiSidebarMenuItem>
            <UiDropdownMenu>
              <UiDropdownMenuTrigger as-child>
                <UiSidebarMenuButton
                  size="lg"
                  class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <UiAvatar class="size-8 rounded-lg">
                    <UiAvatarImage :src="data.user.avatar" :alt="data.user.name" />
                    <UiAvatarFallback class="rounded-lg">BB</UiAvatarFallback>
                  </UiAvatar>
                  <div class="grid flex-1 text-left text-sm leading-tight">
                    <span class="truncate font-semibold">{{ data.user.name }}</span>
                    <span class="truncate text-xs">{{ data.user.email }}</span>
                  </div>
                  <Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
                </UiSidebarMenuButton>
              </UiDropdownMenuTrigger>
              <UiDropdownMenuContent
                class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                :side="isMobile ? 'bottom' : 'right'"
                :side-offset="4"
                align="end"
              >
                <UiDropdownMenuLabel class="p-0 font-normal">
                  <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                    <UiAvatar class="size-8 rounded-lg">
                      <UiAvatarImage :src="data.user.avatar" :alt="data.user.name" />
                      <UiAvatarFallback class="rounded-lg">BB</UiAvatarFallback>
                    </UiAvatar>
                    <div class="grid flex-1 text-left text-sm leading-tight">
                      <span class="truncate font-semibold">{{ data.user.name }}</span>
                      <span class="truncate text-xs">{{ data.user.email }}</span>
                    </div>
                  </div>
                </UiDropdownMenuLabel>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuGroup>
                  <UiDropdownMenuItem icon="lucide:sparkles" title="Upgrade to Pro" />
                </UiDropdownMenuGroup>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuGroup>
                  <UiDropdownMenuItem icon="lucide:badge-check" title="Account" />
                  <UiDropdownMenuItem icon="lucide:credit-card" title="Billing" />
                  <UiDropdownMenuItem icon="lucide:settings-2" title="Settings" />
                  <UiDropdownMenuItem icon="lucide:bell" title="Notifications" />
                </UiDropdownMenuGroup>
                <UiDropdownMenuSeparator />
                <UiDropdownMenuItem icon="lucide:log-out" title="Log out" />
              </UiDropdownMenuContent>
            </UiDropdownMenu>
          </UiSidebarMenuItem>
        </UiSidebarMenu>
      </UiSidebarFooter>
    </UiSidebar>
    <!-- Sidebar main content -->
    <UiSidebarInset>
      <!-- Navbar -->
      <UiNavbar sticky class="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <UiSidebarTrigger class="-ml-1" />
        <UiSeparator orientation="vertical" class="mr-2 h-4" />
        <UiBreadcrumbs :items="breadcrumbItems" />
      </UiNavbar>
      <div class="grid auto-rows-min gap-4 p-4 md:grid-cols-3">
        <slot />
      </div>
    </UiSidebarInset>
  </UiSidebarProvider>
</template>

<script lang="ts" setup>
  import ProjectSwitcher from "../components/testpoint/projectSwitcher.vue";

  // Fetch test cases from the database
  const { data: projects } = useFetch("/api/projects");

  // Breadcrumb items
  const breadcrumbItems = [
    { label: "Building Your Application", link: "#" },
    { label: "Data Fetching", link: "#" },
  ];
  // This is sample data.
  const data = {
    user: {
      name: "breezy",
      email: "m@example.com",
      avatar: "https://behonbaker.com/icon.png",
    },
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
    navMain: [
      {
        title: "Playground",
        url: "#",
        icon: "lucide:square-terminal",
        isActive: true,
        items: [
          {
            title: "History",
            url: "#",
          },
          {
            title: "Starred",
            url: "#",
          },
          {
            title: "Settings",
            url: "#",
          },
        ],
      },
      {
        title: "Models",
        url: "#",
        icon: "lucide:bot",
        items: [
          {
            title: "Genesis",
            url: "#",
          },
          {
            title: "Explorer",
            url: "#",
          },
          {
            title: "Quantum",
            url: "#",
          },
        ],
      },
      {
        title: "Documentation",
        url: "#",
        icon: "lucide:book-open",
        items: [
          {
            title: "Introduction",
            url: "#",
          },
          {
            title: "Get Started",
            url: "#",
          },
          {
            title: "Tutorials",
            url: "#",
          },
          {
            title: "Changelog",
            url: "#",
          },
        ],
      },
      {
        title: "Settings",
        url: "#",
        icon: "lucide:settings-2",
        items: [
          {
            title: "General",
            url: "#",
          },
          {
            title: "Team",
            url: "#",
          },
          {
            title: "Billing",
            url: "#",
          },
          {
            title: "Limits",
            url: "#",
          },
        ],
      },
    ],
    projects: [
      {
        name: "Design Engineering",
        url: "#",
        icon: "lucide:frame",
      },
      {
        name: "Sales & Marketing",
        url: "#",
        icon: "lucide:pie-chart",
      },
      {
        name: "Travel",
        url: "#",
        icon: "lucide:map",
      },
    ],
  };
  const activeTeam = ref(data.teams[1]);
  useSeoMeta({ title: "A sidebar that collapses to icons." });
</script>
