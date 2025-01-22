<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitems";
import type { ISelectedSetting } from "~~/shared/interface/settings";
import { populateSelectedSettings } from "~/utils/settings";

const model = defineModel<Partial<ICheckitem>[]>({
  default: () => [],
});

const newCheckitem = ref<Partial<ICheckitem>>({
  settings: [],
});

const isSheetOpen = ref(false);
const editedCheckitem = ref<Partial<ICheckitem> | null>(null);
const selectedSettings = ref<ISelectedSetting[]>([]);

/**
 * @brief Initializes the newCheckitem object with default values.
 */
function initializeCheckitem() {
  newCheckitem.value = {
    settings: [],
  };
}

/**
 * @brief Watches for changes in selectedSettings and updates newCheckitem.settings.
 */
watch(selectedSettings, () => {
  newCheckitem.value.settings = selectedSettings.value.flatMap(
    (selectedSetting) => selectedSetting.settings || []
  );
}, { deep: true, flush: "post" });

/**
 * @brief Edits an existing checkitem.
 * @param checkitem - The checkitem to edit.
 */
function editCheckitem(checkitem: Partial<ICheckitem>) {
  editedCheckitem.value = checkitem;
  newCheckitem.value = { ...checkitem };

  // Populate selectedSettings using the utility function
  selectedSettings.value = populateSelectedSettings(checkitem.settings || []);

  isSheetOpen.value = true; // Open the sheet when editing
}

/**
 * @brief Adds a new checkitem to the model.
 */
function addNewCheckitem() {
  model.value.push({ ...newCheckitem.value });
  initializeCheckitem();
  selectedSettings.value = [];
  isSheetOpen.value = false; // Close the sheet after adding
}

/**
 * @brief Updates the edited checkitem in the model.
 */
function updateCheckitem() {
  if (editedCheckitem.value) {
    const index = model.value.findIndex(
      (item) => item.id === editedCheckitem.value?.id
    );
    if (index !== -1) {
      model.value[index] = { ...newCheckitem.value };
    }
  }
  editedCheckitem.value = null;
  initializeCheckitem();
  selectedSettings.value = [];
  isSheetOpen.value = false; // Close the sheet after updating
}

/**
 * @brief Deletes a checkitem from the model.
 * @param checkitem - The checkitem to delete.
 */
function deleteCheckitem(checkitem: Partial<ICheckitem>) {
  model.value = model.value.filter((item) => item.id !== checkitem.id);
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
        @edit="editCheckitem"
        @delete="deleteCheckitem"
      />
    </div>

    <div>
      <UiSheet should-scale-background class="pt-2" :open="isSheetOpen" @update:open="isSheetOpen = $event">
        <UiSheetTrigger as-child>
          <UiButton variant="outline"> Add New Checkitem </UiButton>
        </UiSheetTrigger>
        <UiSheetContent
          class="sm:max-w-none md:w-[650px]"
          side="right"
          :title="editedCheckitem ? 'Edit Checkitem' : 'New Checkitem'"
        >
          <template #content>
            <div class="mx-auto w-full rounded-t-lg p-4 pb-10">
              <div class="relative">
                <form id="formCheckitem" @submit.prevent="editedCheckitem ? updateCheckitem() : addNewCheckitem()">
                  <fieldset class="grid gap-3">
                    <div class="flex flex-row gap-3">
                      <UiVeeInput
                        v-model="newCheckitem.module"
                        label="Module"
                        class="w-200 text-sm"
                      />
                      <UiVeeInput
                        v-model="newCheckitem.expectedTarget"
                        label="Expected Target"
                        class="text-sm"
                      />
                    </div>
                    <div>
                      <label class="block text-sm font-medium text-gray-700 mb-1">
                        Required Settings
                      </label>
                      <TSettingsSelection v-model="selectedSettings" />
                    </div>
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
                  {{ editedCheckitem ? "Update" : "Add" }}
                </UiButton>
              </UiSheetClose>
            </UiSheetFooter>
          </template>
        </UiSheetContent>
      </UiSheet>
    </div>
  </div>
</template>
