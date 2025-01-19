<script setup lang="ts">
import type { Checkitem } from "@prisma/client"
import consola from "consola"

const model = defineModel<Checkitem[]>({
  default: () => [],
})

// Initialize a new Checkitem with default values
const newCheckitem = ref<Checkitem>({
  id: "-",
  module: "Unknown",
  expectedTarget: "No Hang",
  requiredSettings: "Settings ...",
})

function addNewCheckitem() {
  consola.log("Adding new item")

  // Create a new object for the Checkitem
  const itemToAdd = { ...newCheckitem.value }
  model.value.push(itemToAdd)

  consola.log("Updated model:", model.value)

  // Reset newCheckitem to default values for the next input
  newCheckitem.value = {
    id: "-",
    module: "Unknown",
    expectedTarget: "No Hang",
    requiredSettings: "Settings ...",
  }
}
</script>

<template>
  <div class="w-full gap-1">
    <div>
      <div v-for="(checkitem, i) in model" :key="i" class="relative flex flex-col gap-4 rounded-lg border p-4 shadow-sm shadow-black/5 border-ring">
        <p>Module: {{ checkitem.module }}</p>
        <p>Expected Target: {{ checkitem.expectedTarget }}</p>
        <p>Settings: {{ checkitem.requiredSettings }}</p>
      </div>
    </div>
    <UiDrawer should-scale-background class="pt-2">
      <UiDrawerTrigger as-child>
        <UiButton variant="outline">
          Add New Checkitem
        </UiButton>
      </UiDrawerTrigger>
      <UiDrawerContent>
        <div class="mx-auto w-full rounded-t-lg p-4 pb-10">
          <UiDrawerTitle class="mb-1.5">
            New Checkitem
          </UiDrawerTitle>
          <UiDrawerDescription />
          <div class="relative">
            <form @submit.prevent="addNewCheckitem">
              <fieldset class="grid gap-3">
                <div class="flex flex-row gap-3">
                  <UiVeeInput
                    v-model="newCheckitem.module"
                    label="Module"
                    class="w-200"
                  />
                  <UiVeeInput
                    v-model="newCheckitem.expectedTarget"
                    label="Expected Target"
                  />
                </div>
                <UiVeeInput
                  v-model="newCheckitem.requiredSettings"
                  label="Required Settings"
                />
                <UiDrawerClose as-child>
                  <UiButton type="submit">
                    Add
                  </UiButton>
                </UiDrawerClose>
              </fieldset>
            </form>
          </div>

          <UiDrawerClose class="absolute right-4 top-3 h-7 w-7" as-child>
            <UiButton variant="ghost" size="icon-sm" class="opacity-50 hover:opacity-100">
              <Icon name="lucide:x" />
            </UiButton>
          </UiDrawerClose>
        </div>
      </UiDrawerContent>
    </UiDrawer>
  </div>
</template>

<style lang="scss" scoped>
</style>
