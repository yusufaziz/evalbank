<script setup lang="ts">
import type { Project } from "@prisma/client"

const props = defineProps({
  state: {
    type: String,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
  projectId: {
    type: String,
    required: true,
  },
})

const { data: projects } = useFetch<Project[]>("/api/projects?limit=20")
const { data: project } = useFetch<Project>(`/api/projects/${props.projectId}`)
const { data: info, refresh: refreshInfo } = useFetch<{ name: string, judgement: number, total: number, color: string }[]>(`/api/projects/sidebar/${props.projectId}`)
useEventBus("project:info").on((e) => {
  if (e === "refresh") {
    refreshInfo()
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
                :class="[props.projectId === projectItem.id && 'bg-muted']"
                @click="navigateTo(`/projects/${projectItem.id}`)"
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
    <div class="flex flex-col text-sm p-2 border rounded">
      <UiChartDonut index="name" category="total" :data="info || []" type="pie" :colors="info?.map(i => i.color)" />
    </div>
  </UiSidebarHeader>
</template>
