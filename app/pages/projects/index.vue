<script lang="ts" setup>
import type { Project } from "@prisma/client"
import type { ColumnDef, Table } from "@tanstack/vue-table"
import { ref } from "vue"

/**
 * @brief Component for listing all projects.
 * @details This component displays a table of projects with filtering and column toggling.
 */
const tableRef = ref()
const table = ref<Table<Project> | null>(null)
const search = ref("")

// Fetch data for projects
const { data: projects } = useFetch<Project[]>("/api/projects")

// Refresh data when triggered by an event
useEventBus("refresh:projects").on((e) => {
  if (e === "all") {
    refreshNuxtData()
  }
})

/**
 * @brief Column definitions for the projects table.
 */
const columns: ColumnDef<Project>[] = [
  { accessorKey: "name", header: "Project Name", enableHiding: true },
  { accessorKey: "modelFY", header: "FY", enableHiding: true },
  { accessorKey: "modelSeries", header: "Model Series", enableHiding: true },
  { accessorKey: "modelName", header: "Model Name", enableHiding: true },
  {
    accessorKey: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        resolveComponent("TActionButton"),
        {
          id: row.original.id,
          endpoint: "projects",
          duplicate: true,
          view: true,
          remove: true,
          edit: true,
        },
      )
    },
  },
]
</script>

<template>
  <div>
    <div class="flex flex-col gap-5 md:flex-row md:items-center">
      <!-- Search Input -->
      <UiInput v-model="search" type="search" placeholder="Search" class="w-full md:w-96" />

      <!-- Column Visibility Dropdown -->
      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton variant="outline">
            <span>
              View
            </span>
            <Icon name="lucide:chevron-down" class="h-4 w-4" />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent :side-offset="10" align="start" class="w-[300px] md:w-[200px]">
          <UiDropdownMenuLabel>
            Toggle Columns
          </UiDropdownMenuLabel>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuGroup>
            <UiDropdownMenuCheckboxItem
              v-for="column in table?.getAllColumns().filter((column) => column.getCanHide())"
              :key="column.id"
              :checked="column.getIsVisible()"
              @update:checked="tableRef?.toggleColumnVisibility(column)"
            >
              <span class="text-sm capitalize">
                {{ column?.id }}
              </span>
            </UiDropdownMenuCheckboxItem>
          </UiDropdownMenuGroup>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

    <!-- Projects Table -->
    <UiTanStackTable
      ref="tableRef"
      :search="search"
      :data="projects"
      :columns="columns"
      class="mt-1 rounded-md border"
      @ready="table = $event"
    >
      <template #empty>
        <div class="flex w-full flex-col items-center justify-center gap-5 py-5">
          <Icon name="lucide:database" class="h-12 w-12 text-muted-foreground" />
          <span class="mt-2">
            No data available.
          </span>
        </div>
      </template>
    </UiTanStackTable>
  </div>
</template>
