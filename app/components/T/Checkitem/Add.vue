<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitem"
import type { ISelectedSetting } from "~~/shared/interface/setting"
import consola from "consola"
import { populateSelectedSettings } from "~/utils/settings"

const model = defineModel<Partial<ICheckitem>[]>({
  default: () => [],
})

const newCheckitem = ref<Partial<ICheckitem>>({
  settings: [],
})

const isSheetOpen = ref(false)
const editedIndex = ref(-1)
const selectedSettings = ref<ISelectedSetting[]>([])

/**
 * @brief Initializes the newCheckitem object with default values.
 */
function initializeCheckitem() {
  consola.log("initializeCheckitem")
  editedIndex.value = -1
  newCheckitem.value = {
    settings: [],
  }
  selectedSettings.value = []
}

/**
 * @brief Watches for changes in selectedSettings and updates newCheckitem.settings.
 */
watch(selectedSettings, () => {
  newCheckitem.value.settings = selectedSettings.value.flatMap(
    selectedSetting => selectedSetting.settings || [],
  )
}, { deep: true, flush: "post" })

/**
 * @brief Edits an existing checkitem.
 * @param checkitem - The checkitem to edit.
 */
function editCheckitem(checkitem: Partial<ICheckitem>, index: number) {
  consola.log(checkitem, index)
  editedIndex.value = index
  newCheckitem.value = { ...checkitem }
  // Populate selectedSettings using the utility function
  selectedSettings.value = populateSelectedSettings(checkitem.settings || [])
  isSheetOpen.value = true // Open the sheet when editing
}

/**
 * @brief Adds a new checkitem to the model.
 */
function addNewCheckitem() {
  model.value.push({
    ...newCheckitem.value,
    settings: convertSelectedSetting(selectedSettings.value),
  })
  isSheetOpen.value = false // Close the sheet after adding
}

/**
 * @brief Updates the edited checkitem in the model.
 */
function updateCheckitem() {
  model.value[editedIndex.value] = {
    ...newCheckitem.value,
    settings: convertSelectedSetting(selectedSettings.value),
  }
  isSheetOpen.value = false // Close the sheet after updating
}

/**
 * @brief Deletes a checkitem from the model using its index.
 * @param index - The index of the checkitem to delete.
 */
function deleteCheckitem(index: number) {
  if (index >= 0 && index < model.value.length) {
    model.value.splice(index, 1) // Remove the checkitem at the specified index
  }
  else {
    consola.error("Invalid index:", index)
  }
}
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex flex-col gap-2">
      <TCheckitemView
        v-for="(checkitem, i) in model"
        :key="i"
        :checkitem="checkitem"
        :modify="true"
        @edit="editCheckitem(checkitem, i)"
        @delete="deleteCheckitem(i)"
      />
    </div>

    <div>
      <UiSheet
        should-scale-background
        class="pt-2"
        :open="isSheetOpen"
        @update:open="isSheetOpen = $event"
      >
        <!-- UiSheet -->
        should-scale-background
        class="pt-2"
        :open="isSheetOpen"
        @update:open="isSheetOpen = $event"
        <UiSheetTrigger as-child>
          <UiButton variant="outline" @click="initializeCheckitem()">
            Add New Checkitem
          </UiButton>
        </UiSheetTrigger>
        <UiSheetContent
          class="sm:max-w-none md:w-[650px]"
          side="right"
          :title="editedIndex >= 0 ? 'Edit Checkitem' : 'New Checkitem'"
        >
          <template #content>
            <div class="mx-auto w-full rounded-t-lg p-4 pb-10">
              <div class="relative">
                <form id="formCheckitem" @submit.prevent="editedIndex >= 0 ? updateCheckitem() : addNewCheckitem()">
                  <fieldset class="grid gap-3">
                    <UiVeeInput
                      v-model="newCheckitem.module"
                      label="Module"
                      class="text-sm"
                    />
                    <UiVeeInput
                      v-model="newCheckitem.expectedTarget"
                      label="Expected Target"
                      class="text-sm"
                    />
                    <TSettingSelection v-model="selectedSettings" />
                  </fieldset>
                </form>
              </div>
            </div>
          </template>

          <template #footer>
            <UiSheetFooter>
              <UiSheetClose as-child>
                <UiButton
                  variant="outline"
                  type="button"
                  class="mt-2 sm:mt-0"
                  @click="isSheetOpen = false"
                >
                  Cancel
                </UiButton>
              </UiSheetClose>
              <UiSheetClose as-child>
                <UiButton type="submit" class="text-sm" form="formCheckitem">
                  {{ editedIndex >= 0 ? "Update" : "Add" }}
                </UiButton>
              </UiSheetClose>
            </UiSheetFooter>
          </template>
        </UiSheetContent>
      </UiSheet>
    </div>
  </div>
</template>
