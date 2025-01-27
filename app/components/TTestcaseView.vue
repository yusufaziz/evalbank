<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"

const props = defineProps({
  id: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true,
  },
  procedures: {
    type: String,
    required: true,
  },
  checkitems: {
    type: Array as () => ICheckitem[] | undefined,
    required: true,
  },
  syncBtn: {
    type: Boolean,
    default: false,
  },
  unsyncBtn: {
    type: Boolean,
    default: false,
  },
})
const emit = defineEmits(["needRefresh"])
const procedures = props.procedures.split("\n")

function onSyncdata() {
  useSonner.promise(
    $fetch<any>(`/api/projects/sync`, {
      method: "patch",
      body: {
        projectId: useRoute().params.projectId,
        testcaseId: props.id,
      },
    })
      .then((response) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            emit("needRefresh")
            resolve(response)
          }, 1000) // 1-second delay
        })
      }),
    {
      loading: "Generating Evaluation Data ...",
      success: () => "Sucess generating",
      error: () => "Error! Something went wrong during generationg data!",
    },
  )
}
function onUnSyncdata() {
  useSonner.promise(
    $fetch<any>(`/api/projects/unsync`, {
      method: "patch",
      body: {
        projectId: useRoute().params.projectId,
        testcaseId: props.id,
      },
    })
      .then((response) => {
        return new Promise((resolve) => {
          setTimeout(() => {
            emit("needRefresh")
            resolve(response)
          }, 1000) // 1-second delay
        })
      }),
    {
      loading: "Removing testcase from project ...",
      success: () => "Sucess removing testcase.",
      error: () => "Error! Something went wrong during generationg data!",
    },
  )
}
</script>

<template>
  <UiCollapsible class="w-[calc(100svw-30rem)]">
    <div class="flex items-center justify-between">
      <h4 class="text-sm font-semibold">
        {{ props.name }}
      </h4>
      <div class="flex flex-row gap-2">
        <UiCollapsibleTrigger as-child>
          <UiButton variant="ghost" size="sm" class="w-9 p-0">
            <Icon name="lucide:chevrons-up-down" class="h-4 w-4" />
            <span class="sr-only">Toggle</span>
          </UiButton>
        </UiCollapsibleTrigger>
        <UiButton v-if="useRoute().name === 'projects-projectId' && props.syncBtn" size="sm" class="w-9 p-0" @click="onSyncdata">
          <Icon name="lucide:plus" class="h-4 w-4" />
          <span class="sr-only">Add</span>
        </UiButton>
        <UiButton v-if="useRoute().name === 'projects-projectId' && props.unsyncBtn" size="sm" class="w-9 p-0" @click="onUnSyncdata">
          <Icon name="lucide:trash" class="h-4 w-4" />
          <span class="sr-only">Delete</span>
        </UiButton>
      </div>
    </div>
    <UiCollapsibleContent v-if="procedures.length > 0" class="">
      <UiDivider label="Procedures" />
      <p v-for="(p, i) in procedures" :key="i" class="text-sm">
        {{ i + 1 }}.  {{ p }}
      </p>
      <UiDivider label="Checkitems" />
      <TCheckitemView v-for="(checkitem, i) in props.checkitems" :key="i" :checkitem="checkitem" @need-refresh="emit('needRefresh')" />
    </UiCollapsibleContent>
  </UiCollapsible>
</template>

<style lang="scss" scoped>

</style>
