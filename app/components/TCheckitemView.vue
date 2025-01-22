<script setup lang="ts">
import type { ICheckitem } from "~~/shared/interface/checkitems"

const props = defineProps({
  checkitem: {
    type: Object as () => Partial<ICheckitem>,
    required: true,
  },
  modify: {
    type: Boolean,
    default: false, // Default to false if not provided
  },
})

const emit = defineEmits(["edit", "delete", "needRefresh"])

/**
 * @brief Computes the settings tags for display.
 * @output An array of strings representing the settings.
 */
const settingsTags = computed(() => {
  return [...new Set(props.checkitem.settings?.map(c => c.name))]
    .map(name => `${name}: ${props.checkitem.settings?.filter(f => f.name === name).map(s => s.value).join(",")}`) || []
})
</script>

<template>
  <div class="rounded-lg border border-input p-2">
    <div class="flex items-center justify-between">
      <span>{{ props.checkitem.expectedTarget }}</span>
      <div class="flex flex-row gap-2">
        <UiBadge>{{ props.checkitem.module }}</UiBadge>
        <div v-if="modify" class="flex gap-2">
          <UiButton variant="outline" size="icon-xs" @click="emit('edit', props.checkitem)">
            <Icon name="lucide:pencil" />
          </UiButton>
          <UiButton variant="destructive" size="icon-xs" @click="emit('delete', props.checkitem)">
            <Icon name="lucide:trash" />
          </UiButton>
        </div>
      </div>
    </div>
    <div v-if="settingsTags.length > 0 && !props.checkitem.evaluations" class="mt-2 flex flex-wrap gap-2">
      <UiBadge v-for="(tag, index) in settingsTags" :key="index" variant="secondary">
        {{ tag }}
      </UiBadge>
    </div>
    <div v-if="props.checkitem.evaluations" class="p-2 text-sm flex flex-wrap gap-3">
      <div v-for="(e, i) in props.checkitem.evaluations" :key="i" class="border rounded-sm p-2">
        <div>
          <p v-for="(settingEval, idxSettingEval) in e.settings.map((s) => `${s.name}: ${s.value}`)" :key="idxSettingEval">
            {{ settingEval }}
          </p>
        </div>
        <div>
          <UiToggleGroup class="item-start justify-start pt-2">
            <UiRadioGroup default-value="todo">
              <div class="flex space-x-2">
                <UiRadioGroupItem id="r1" value="1" />
                <UiLabel for="r1">
                  Not Supported
                </UiLabel>
              </div>
              <div class="flex items-center space-x-2">
                <UiRadioGroupItem id="r2" value="2" />
                <UiLabel for="r2">
                  NG
                </UiLabel>
              </div>
              <div class="flex items-center space-x-2">
                <UiRadioGroupItem id="r3" value="3" />
                <UiLabel for="r3">
                  OK
                </UiLabel>
              </div>
            </UiRadioGroup>
          </UiToggleGroup>
        </div>
      </div>
    </div>
  </div>
</template>
