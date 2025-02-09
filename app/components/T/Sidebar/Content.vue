<script setup lang="ts">
/**
 * @brief Component for rendering the sidebar content.
 * @details This component displays navigation menus for projects, test cases, and settings, along with project-specific actions.
 */
const props = defineProps({
  /**
   * The current state of the sidebar (e.g., expanded or collapsed).
   */
  state: {
    type: String,
    required: true,
  },
  /**
   * Whether the sidebar is displayed on a mobile device.
   */
  isMobile: {
    type: Boolean,
    required: true,
  },
})

// Determine if a project ID is present in the route query
const route = useRoute()
const isHasProject = !!route.query.projectId

/**
 * @brief Navigation menu items for the main sections.
 */
const navMain = [
  {
    title: "Projects",
    url: "#",
    icon: "lucide:package",
    isActive: true,
    items: [
      {
        title: "Add New Project",
        url: "/projects/create",
      },
      {
        title: "Show Projects",
        url: "/projects",
      },
    ],
  },
  {
    title: "Testcases",
    url: "#",
    icon: "lucide:bot",
    items: [
      {
        title: "Add New Testcases",
        url: "/testcases/create",
      },
      {
        title: "Show Testcases",
        url: "/testcases",
      },
    ],
  },
  {
    title: "Settings",
    url: "#",
    icon: "lucide:settings-2",
    items: [
      {
        title: "Add New Settings",
        url: "/settings/create",
      },
      {
        title: "Show Settings",
        url: "/settings",
      },
    ],
  },
]

/**
 * @brief Example project data for demonstration purposes.
 */
const projectsData = [
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
]
</script>

<template>
  <UiSidebarContent>
    <!-- Project Menus -->
    <UiSidebarGroup v-if="isHasProject" class="group-data-[collapsible=icon]:hidden">
      <UiSidebarGroupLabel label="Projects Dashboard" />
      <UiSidebarMenu>
        <UiSidebarMenuItem v-for="item in projectsData" :key="item.name">
          <UiSidebarMenuButton as-child>
            <NuxtLink :href="item.url">
              <Icon mode="svg" :name="item.icon" />
              <span>
                {{ item.name }}
              </span>
            </NuxtLink>
          </UiSidebarMenuButton>
          <!-- UiSidebarMenuButton -->
          as-child
          <NuxtLink
            :href="item.url"
          >
            <Icon
              mode="svg"
              :name="item.icon"
            />
            <span>
              {{ item.name }}
            </span>
          </NuxtLink>
          <UiDropdownMenu>
            <UiDropdownMenuTrigger as-child>
              <UiSidebarMenuAction show-on-hover>
                <Icon mode="svg" name="lucide:ellipsis-vertical" class="rotate-90" />
                <span class="sr-only">
                  More
                </span>
              </UiSidebarMenuAction>
            </UiDropdownMenuTrigger>
            <UiDropdownMenuContent
              class="w-48 rounded-lg"
              :side="props.isMobile ? 'bottom' : 'right'"
              :align="props.isMobile ? 'end' : 'start'"
            >
              <UiDropdownMenuItem>
                <Icon mode="svg" name="lucide:folder" class="text-muted-foreground" />
                <span>
                  View Project
                </span>
              </UiDropdownMenuItem>
              <UiDropdownMenuItem>
                <Icon name="lucide:forward" class="text-muted-foreground" />
                <span>
                  Share Project
                </span>
              </UiDropdownMenuItem>
              <UiDropdownMenuSeparator />
              <UiDropdownMenuItem>
                <Icon name="lucide:trash-2" class="text-muted-foreground" />
                <span>
                  Delete Project
                </span>
              </UiDropdownMenuItem>
            </UiDropdownMenuContent>
          </UiDropdownMenu>
        </UiSidebarMenuItem>
        <UiSidebarMenuItem>
          <UiSidebarMenuButton class="text-sidebar-foreground/70">
            <Icon name="lucide:ellipsis-vertical" class="rotate-90 text-sidebar-foreground/70" />
            <span>
              More
            </span>
          </UiSidebarMenuButton>
        </UiSidebarMenuItem>
      </UiSidebarMenu>
    </UiSidebarGroup>

    <!-- Main Navigation -->
    <UiSidebarGroup>
      <UiSidebarGroupLabel label="Testpoint" />
      <UiSidebarMenu>
        <UiCollapsible
          v-for="(item, index) in navMain"
          :key="index"
          v-slot="{ open }"
          as-child
          :default-open="item.isActive"
        >
          <UiSidebarMenuItem>
            <UiCollapsibleTrigger as-child>
              <UiSidebarMenuButton :tooltip="item.title">
                <Icon mode="svg" :name="item.icon" />
                <span>
                  {{ item.title }}
                </span>
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
                      <span>
                        {{ subItem.title }}
                      </span>
                    </NuxtLink>
                  </UiSidebarMenuSubButton>
                </UiSidebarMenuSubItem>
              </UiSidebarMenuSub>
            </UiCollapsibleContent>
          </UiSidebarMenuItem>
        </UiCollapsible>
      </UiSidebarMenu>
    </UiSidebarGroup>
  </UiSidebarContent>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
