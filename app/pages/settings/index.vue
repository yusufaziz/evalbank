<script lang="ts" setup>
import type { ISetting } from "~~/shared/interface/setting"
import { TSettingView } from "#components"

// Fetch data for settings
const { data: settings } = useFetch<ISetting[]>("/api/settings")

// Refresh data when triggered by an event
useEventBus("refresh:settings").on((e) => {
  if (e === "all") {
    refreshNuxtData()
  }
})
</script>

<template>
  <TSettingView :settings="settings || []" :show-action-button="true" :show-control="true" />
</template>
