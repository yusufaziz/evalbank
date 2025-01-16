<script lang="ts" setup>
import type { Project } from "@prisma/client"
import type { ColumnDef, Table } from "@tanstack/vue-table"

const tableRef = ref()
const table = ref<Table<Project> | null>(null)
const search = ref("")

const { data: projects, refresh: refreshProjects } = useFetch<Project[]>("/api/projects")

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
    cell: (value) => {
      return h(
        resolveComponent("UiButton"),
        {
          variant: "outline",
          size: "icon",
          class: "w-9 h-9",
          onClick: () => navigateTo(`/projects/${value.row.original.id}`),
        },
        () => [h(resolveComponent("Icon"), { name: "lucide:eye", class: "h-4 w-4" })],
      )
    },
  },
  {
    accessorKey: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: (value) => {
      return h(
        resolveComponent("UiButton"),
        {
          variant: "ghost",
          size: "icon",
          class: "w-9 h-9",
          onClick: () => {
            useSonner(`TODO: Duplicate Projects: ${value.row.original.id}`, {
              duration: 3000,
            })
          },
        },
        () => [h(resolveComponent("Icon"), { name: "lucide:copy", class: "h-4 w-4" })],
      )
    },
  },
  {
    accessorKey: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: (value) => {
      return h(
        resolveComponent("UiButton"),
        {
          variant: "outline",
          size: "icon",
          class: "w-9 h-9",
          onClick: () => navigateTo(`/projects/modify/${value.row.original.id}`),
        },
        () => [h(resolveComponent("Icon"), { name: "lucide:pen", class: "h-4 w-4" })],
      )
    },
  },
  {
    accessorKey: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: (value) => {
      return h(
        resolveComponent("UiButton"),
        {
          variant: "destructive",
          size: "icon",
          class: "w-9 h-9",
          onClick: () => {
            useSonner.promise(useFetch(`/api/projects/${value.row.original.id}`, {
              method: "delete",
            }), {
              loading: "Deleting projects...",
              success: () => "Data has been deleted",
              error: () => "Error! Couldn't delete data on database.",
            })
            refreshProjects()
          },
        },
        () => [h(resolveComponent("Icon"), { name: "lucide:trash", class: "h-4 w-4" })],
      )
    },
  },
]
</script>

<template>
  <div style="width: max-content">
    <div class="flex flex-col gap-5 md:flex-row md:items-center">
      <UiInput v-model="search" type="search" placeholder="Search" class="w-full md:w-96" />
      <UiDropdownMenu>
        <UiDropdownMenuTrigger as-child>
          <UiButton variant="outline">
            <span>View</span>
            <Icon name="lucide:chevron-down" class="h-4 w-4" />
          </UiButton>
        </UiDropdownMenuTrigger>
        <UiDropdownMenuContent :side-offset="10" align="start" class="w-[300px] md:w-[200px]">
          <UiDropdownMenuLabel> Toggle Columns </UiDropdownMenuLabel>
          <UiDropdownMenuSeparator />
          <UiDropdownMenuGroup>
            <UiDropdownMenuCheckboxItem
              v-for="column in table?.getAllColumns().filter((column) => column.getCanHide())"
              :key="column.id"
              :checked="column.getIsVisible()"
              @update:checked="tableRef?.toggleColumnVisibility(column)"
            >
              <span class="text-sm capitalize">{{ column?.id }}</span>
            </UiDropdownMenuCheckboxItem>
          </UiDropdownMenuGroup>
        </UiDropdownMenuContent>
      </UiDropdownMenu>
    </div>

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
          <span class="mt-2">No data available.</span>
        </div>
      </template>
    </UiTanStackTable>
  </div>
</template>
