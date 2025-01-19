<script setup lang="ts">
import type { Checkitem } from "@prisma/client"
import type { IGroupedSettings } from "~~/shared/interface/settings"

const model = defineModel<Checkitem[]>({
  default: () => [],
})
const newCheckitem = ref<Checkitem>({
  id: "-",
  module: "Unknown",
  expectedTarget: "No target described",
  requiredSettings: "",
})
const isSheetOpen = ref(false) // Control the open state of the sheet

function initalizeCheckitem() {
  newCheckitem.value = {
    id: "-",
    module: "Unknown",
    expectedTarget: "No target described",
    requiredSettings: "",
  }
}
const { data: settings } = useFetch<IGroupedSettings[]>("/api/settings?group=name")
const editedCheckitem = ref<Checkitem | null>(null)
const selectedSettings = ref<{ setting: string, additionalData: string[] }[]>([])
const showAdditional = ref()

watch(selectedSettings, () => {
  newCheckitem.value.requiredSettings = selectedSettings.value
    .map(item => `${item.setting}${item.additionalData.length > 0 ? `(${item.additionalData.join(",")})` : ""}`)
    .join("|")
}, { deep: true, flush: "post" })

// Initialize selected settings when editing a Checkitem
watch(
  () => newCheckitem.value.requiredSettings,
  (value) => {
    if (value) {
      selectedSettings.value = value.split("|").map((s) => {
        const [setting, additionalData] = s.split(/[()]/)
        return {
          setting: setting?.trim(),
          additionalData: additionalData
            ? additionalData.split(",").map(d => d.trim())
            : [],
        }
      })
    }
    else {
      selectedSettings.value = []
    }
  },
  { immediate: true },
)

function addNewCheckitem() {
  model.value.push({ ...newCheckitem.value })
  initalizeCheckitem()
  selectedSettings.value = []
  isSheetOpen.value = false // Close the sheet after adding
}

function editCheckitem(checkitem: Checkitem) {
  editedCheckitem.value = checkitem
  newCheckitem.value = { ...checkitem }
  isSheetOpen.value = true // Open the sheet when editing
}

function updateCheckitem() {
  if (editedCheckitem.value) {
    const index = model.value.findIndex(item => item.id === editedCheckitem.value?.id)
    if (index !== -1) {
      model.value[index] = { ...newCheckitem.value }
    }
  }
  editedCheckitem.value = null
  initalizeCheckitem()
  selectedSettings.value = []
  isSheetOpen.value = false // Close the sheet after updating
}

function deleteCheckitem(checkitem: Checkitem) {
  model.value = model.value.filter(item => item.id !== checkitem.id)
}
</script>

<template>
  <div class="w-full flex flex-col gap-3">
    <div class="flex flex-col gap-2">
      <TestpointPartViewCheckitem
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
          <UiButton variant="outline">
            Add New Checkitem
          </UiButton>
        </UiSheetTrigger>
        <UiSheetContent
          class="sm:max-w-none md:w-[650px]"
          side="right"
          :title="(editedCheckitem ? 'Edit Checkitem' : 'New Checkitem')"
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
                      <UiScrollArea class="h-[calc(100vh-300px)] w-full rounded-md border p-4">
                        <div v-for="(item, index) in selectedSettings" :key="index" class="mb-4">
                          <div class="flex items-center gap-2">
                            <UiSelect v-model="item.setting">
                              <UiSelectTrigger placeholder="Select an Setting" />
                              <UiSelectContent>
                                <UiSelectItem v-for="(setting, i) in settings" :key="i" :value="setting.name" :text="setting.name" />
                              </UiSelectContent>
                            </UiSelect>
                            <UiButton
                              :variant="(item.additionalData.length > 0 ? 'default' : 'ghost')"
                              size="icon"
                              @click="(showAdditional ? showAdditional = null : showAdditional = item.setting)"
                            >
                              <Icon class="size-4" name="lucide:list-collapse" />
                            </UiButton>
                            <UiButton
                              variant="destructive"
                              size="icon"
                              @click="selectedSettings.splice(index, 1)"
                            >
                              <Icon class="size-4" name="lucide:trash" />
                            </UiButton>
                          </div>
                          <div v-if="showAdditional && showAdditional === item.setting" class="mt-2">
                            <UiListbox v-model="item.additionalData" multiple>
                              <UiListboxContent>
                                <UiListboxItem v-for="(p, i) in settings?.find(f => f.name === item.setting).value" :key="i" :value="p">
                                  <span>{{ p }}</span>
                                </UiListboxItem>
                              </UiListboxContent>
                            </UiListbox>
                          </div>
                        </div>
                        <UiButton
                          variant="outline"
                          size="sm"
                          class="text-sm"
                          @click="selectedSettings.push({ setting: '', additionalData: [] })"
                        >
                          Add Other Setting
                        </UiButton>
                      </UiScrollArea>
                    </div>
                  </fieldset>
                </form>
              </div>
            </div>
          </template>

          <template #footer>
            <UiSheetFooter>
              <UiSheetClose as-child>
                <UiButton variant="outline" type="button" class="mt-2 sm:mt-0" @click="isSheetOpen = false">
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
