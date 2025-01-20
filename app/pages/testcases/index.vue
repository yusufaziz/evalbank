<script lang="ts" setup>
import type { Testcase } from "@prisma/client"
import type { ColumnDef, Table } from "@tanstack/vue-table"

const tableRef = ref()
const table = ref<Table<Testcase> | null>(null)
const search = ref("")

const { data: testcases } = useFetch<Testcase[]>("/api/testcases")

const columns: ColumnDef<Testcase>[] = [
  { accessorKey: "id", header: "ID", enableHiding: true },
  { accessorKey: "name", header: "Name", enableHiding: true },
  { accessorKey: "procedures", header: "Testcase", enableHiding: true, cell: ({ row }) => {
    return h(
      resolveComponent("TestpointPartTestcaseProcedureColapsibles"),
      {
        name: row.original.name,
        procedures: row.original.procedures,
        checkitems: row.original.checkitems,
      },
    )
  } },
  {
    accessorKey: "actions",
    header: "",
    enableSorting: false,
    enableHiding: false,
    cell: ({ row }) => {
      return h(
        resolveComponent("TestpointPartFormActionButton"),
        {
          id: row.original.id,
          endpoint: "testcases",
          duplicate: true,
          remove: true,
          edit: true,
          onNeedRefresh: async () => {
            await refreshNuxtData()
          },
        },
      )
    },
  },
]
</script>

<template>
  <div>
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
      :data="testcases"
      :columns="columns"
      class="mt-5 rounded-md border"
      :column-visibility="{ id: false, name: false }"
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
