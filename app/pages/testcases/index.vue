<script lang="ts" setup>
import type { TestCase } from "@prisma/client"
import type { ColumnDef, Table } from "@tanstack/vue-table"

const tableRef = ref()
const table = ref<Table<TestCase> | null>(null)
const search = ref("")

const { data: testcases } = useFetch<TestCase[]>("/api/testCases")

const columns: ColumnDef<TestCase>[] = [
  { accessorKey: "id", header: "ID", enableHiding: true },
  { accessorKey: "name", header: "Testcase Name", enableHiding: true },
  { accessorKey: "procedures", header: "Procedures", enableHiding: true },
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
          onClick: () => navigateTo(`/testcases/modify/${value.row.original.id}`),
        },
        () => [h(resolveComponent("Icon"), { name: "lucide:pen", class: "h-4 w-4" })],
      )
    },
  },
]
</script>

<template>
  <div style="width: max-content">
    <div class="flex flex-col justify-between gap-5 md:flex-row md:items-center">
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
      show-select
      :search="search"
      :data="testcases"
      :columns="columns"
      class="mt-5 rounded-md border"
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
