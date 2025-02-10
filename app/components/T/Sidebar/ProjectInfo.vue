<script setup lang="ts">
import type { Project } from "@prisma/client"
import consola from "consola"

/**
 * @brief Component for displaying project information in the sidebar.
 * @details This component fetches and displays details about the current project, including a dropdown for switching projects.
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

// Route and project-related computed properties
const route = useRoute()
const projectId = computed(() => route.params.projectId as string)
const projectUrl = computed(() => `/api/projects/${projectId.value}`)
const projectInfoUrl = computed(() => `/api/projects/sidebar/${projectId.value}`)

// Fetch data for projects and the current project
const { data: projects } = useFetch<Project[]>("/api/projects?limit=20")
const { data: project } = useFetch<Project>(projectUrl, { watch: [projectId] })
const { data: info, refresh: refreshInfo } = useFetch<
  { name: string, judgement: number, total: number, color: string }[]
>(projectInfoUrl, { watch: [projectId] })

// Event bus listener for refreshing project data
useEventBus("refresh:projects").on((e) => {
  if (e === "info") {
    refreshInfo()
  }
  if (e === "all") {
    refreshNuxtData()
  }
})
function valueFormatter(tick: number | Date) {
  consola.log(tick)
  return typeof tick === "number" ? `${tick.toString()} item` : "-"
}
</script>

<template>
  <UiSidebarHeader>
    <UiSidebarMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenu>
          <!-- Dropdown Trigger -->
          <UiDropdownMenuTrigger as-child>
            <UiSidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <!-- Project Information -->
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">
                  {{ project?.name }}
                </span>
                <span class="truncate text-xs">
                  FY{{ project?.modelFY }} {{ project?.modelSeries }}-{{ project?.modelName }}
                </span>
              </div>
              <!-- Chevron Icon -->
              <Icon mode="svg" name="lucide:chevrons-up-down" class="ml-auto" />
            </UiSidebarMenuButton>
          </UiDropdownMenuTrigger>

          <!-- Dropdown Content -->
          <UiDropdownMenuContent
            class="w-min-lg rounded-lg"
            align="start"
            :side="props.isMobile ? 'bottom' : 'right'"
            :side-offset="4"
          >
            <!-- List of Projects -->
            <template v-for="(projectItem, index) in projects" :key="index">
              <UiDropdownMenuItem
                class="cursor-pointer gap-2 p-2"
                :class="[projectId === projectItem.id && 'bg-muted']"
                @click="
                  navigateTo(`/projects/${projectItem.id}`);
                  refreshNuxtData();
                "
              >
                FY{{ projectItem.modelFY }} {{ projectItem.modelSeries }}-{{ projectItem.modelName }}
                {{ projectItem.name }}
              </UiDropdownMenuItem>
            </template>

            <!-- Separator -->
            <UiDropdownMenuSeparator />

            <!-- Add Project Option -->
            <UiDropdownMenuItem class="gap-2 p-2" @click="navigateTo('/projects/create')">
              <div class="flex size-6 items-center justify-center rounded-md border bg-background">
                <Icon name="lucide:plus" class="size-4" />
              </div>
              <div class="font-medium text-muted-foreground">
                Add Project
              </div>
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>

    <!-- Project Chart -->
    <div
      v-if="props.state === 'expanded'"
      class="flex flex-col text-sm p-2 border rounded"
    >
      <UiChartDonut
        v-if="projectId"
        index="name"
        category="total"
        :data="info || []"
        type="pie"
        :value-formatter="valueFormatter"
        :colors="info?.map((i) => i.color)"
      />
    </div>
  </UiSidebarHeader>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
