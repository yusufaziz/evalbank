<script setup lang="ts">
import type { IEvaluationCount } from "~~/shared/interface/evaluation"

const props = defineProps<{
  /**
   * The evaluation object to display and update.
   */
  evaluationCount: IEvaluationCount | undefined
}>()
</script>

<template>
  <UiHoverCard>
    <UiHoverCardTrigger as-child>
      <UiButton variant="link">
        <Icon class="size-4" name="lucide:notepad-text" />
      </UiButton>
    </UiHoverCardTrigger>
    <UiHoverCardContent class="w-80">
      <div class="grid">
        <span>
          OK: {{ props.evaluationCount?.OK }}
        </span>
        <span>
          NG: {{ props.evaluationCount?.NG }}
        </span>
        <span>
          Not Executed: {{ props.evaluationCount?.NOT_EXECUTED }}
        </span>
        <span>
          Not Supported: {{ props.evaluationCount?.NOT_SUPPORT }}
        </span>
      </div>
    </UiHoverCardContent>
  </UiHoverCard>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
