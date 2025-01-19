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
const { data: projects } = useFetch<Project[]>("/api/projects")
const { data: project } = useFetch<Project>(`/api/projects/${props.projectId}`)
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
                <span class="truncate text-xs">{{ project?.modelName }}</span>
              </div>
              <Icon mode="svg" name="lucide:chevrons-up-down" class="ml-auto" />
            </UiSidebarMenuButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent
            class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            :side="props.isMobile ? 'bottom' : 'right'"
            :side-offset="4"
          >
            <template v-for="(projectItem, index) in projects" :key="index">
              <UiDropdownMenuItem
                class="cursor-pointer gap-2 p-2"
                :class="[props.projectId === projectItem.id && 'bg-muted']"
                @click="props.projectId = projectItem.id"
              >
                {{ projectItem.name }}
              </UiDropdownMenuItem>
            </template>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuItem class="gap-2 p-2">
              <div class="flex size-6 items-center justify-center rounded-md border bg-background">
                <Icon name="lucide:plus" class="size-4" />
              </div>
              <div class="font-medium text-muted-foreground">
                Add team
              </div>
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>

    <!-- Search form -->
    <form v-if="props.state !== 'collapsed'">
      <UiSidebarGroup class="pyproject-0">
        <UiSidebarGroupContent class="relative">
          <UiLabel for="search" class="sr-only">
            Search
          </UiLabel>
          <UiSidebarInput id="search" placeholder="Search the projects..." class="pl-8" />
          <Icon
            name="lucide:search"
            class="pointer-events-none absolute left-2 top-1/2 size-4 -translate-y-1/2 select-none opacity-50"
            data
          />
        </UiSidebarGroupContent>
      </UiSidebarGroup>
    </form>
  </UiSidebarHeader>
</template>
