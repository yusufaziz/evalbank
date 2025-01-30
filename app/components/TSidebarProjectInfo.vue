<script setup lang="ts">
import type { Project } from "@prisma/client"
import consola from "consola"

const props = defineProps({
  state: {
    type: String,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
})
const route = useRoute()
const projectId = computed(() => route.params.projectId)
const projectUrl = computed(() => `/api/projects/${projectId.value}`)
const projectInfoUrl = computed(() => `/api/projects/sidebar/${projectId.value}`)

const { data: projects } = useFetch<Project[]>("/api/projects?limit=20")
const { data: project } = useFetch<Project>(projectUrl, { watch: [projectId] })
const { data: info, refresh: refreshInfo } = useFetch<{ name: string, judgement: number, total: number, color: string }[]>(projectInfoUrl, { watch: [projectId] })
useEventBus("refresh:project").on((e) => {
  if (e === "info") {
    refreshInfo()
  }
  if (e === "all") {
    refreshNuxtData()
  }
})
</script>

<template>
  <UiSidebarHeader>
    <UiSidebarMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiSidebarMenuButton
              size="lg"
              class="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold"> {{ project?.name }} </span>
                <span class="truncate text-xs">FY{{ project?.modelFY }} {{ project?.modelSeries }}-{{ project?.modelName }}</span>
              </div>
              <Icon mode="svg" name="lucide:chevrons-up-down" class="ml-auto" />
            </UiSidebarMenuButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent
            class="w-min-lg rounded-lg"
            align="start"
            :side="props.isMobile ? 'bottom' : 'right'"
            :side-offset="4"
          >
            <template v-for="(projectItem, index) in projects" :key="index">
              <UiDropdownMenuItem
                class="cursor-pointer gap-2 p-2"
                :class="[projectId === projectItem.id && 'bg-muted']"
                @click="navigateTo(`/projects/${projectItem.id}`); refreshNuxtData()"
              >
                FY{{ projectItem.modelFY }} {{ projectItem.modelSeries }}-{{ projectItem.modelName }} {{ projectItem.name }}
              </UiDropdownMenuItem>
            </template>
            <UiDropdownMenuSeparator />
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
    <div v-if="props.state === 'expanded'" class="flex flex-col text-sm p-2 border rounded">
      <UiChartDonut v-if="projectId" index="name" category="total" :data="info || []" type="pie" :colors="info?.map(i => i.color)" />
    </div>
  </UiSidebarHeader>
</template>
