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
            <template v-for="(project, index) in getGroupedProjects()" :key="index">
              <UiDropdownMenuItem
                class="cursor-pointer gap-2 p-2"
                :class="[currentStore.activeProjectsId === project.id && 'bg-muted']"
                @click="currentStore.activeProjectsId = project.id"
              >
                {{ project.name }}
              </UiDropdownMenuItem>
            </template>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuItem class="gap-2 p-2">
              <div class="flex size-6 items-center justify-center rounded-md border bg-background">
                <Icon name="lucide:plus" class="size-4" />
              </div>
              <div class="font-medium text-muted-foreground">Add team</div>
            </UiDropdownMenuItem>
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>

    <!-- Search form -->
    <form v-if="props.state != 'collapsed'">
      <UiSidebarGroup class="pyproject-0">
        <UiSidebarGroupContent class="relative">
          <UiLabel for="search" class="sr-only"> Search </UiLabel>
          <UiSidebarInput id="search" placeholder="Search the docs..." class="pl-8" />
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

<script setup lang="ts">
  import type { Project } from "@prisma/client";

  const currentStore = useCurrentStore();
  const { data: projects } = await useFetch<Project[]>("/api/projects");
  const { data: project, status: projectStatus } = useFetch<Project>(
    () => `api/projects/${currentStore.activeProjectsId}`,
    {
      watch: [currentStore],
      cache: "no-cache",
    }
  );
  interface IGroupedSubProjects {
    title: string;
    item: Project[];
  }
  interface IGroupedProjects {
    title: string;
    item: IGroupedSubProjects;
  }
  function getGroupedProjects() {
    if (projects) {
      let ret = [] as Project[] | undefined;
      const fyUnique = [];
      ret = projects.value;
      return ret;
    } else {
      return [];
    }
  }

  const props = defineProps({
    state: {
      type: String,
      required: true,
    },
    isMobile: {
      type: Boolean,
      required: true,
    },
  });
</script>
