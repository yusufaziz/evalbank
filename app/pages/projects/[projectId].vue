<script lang="ts" setup>
import type { Project } from "@prisma/client"
import { zodProjectSchema } from "~~/shared/schema/project"

const { data: project } = useFetch<Project>(
  `/api/projects/${useRoute().params.projectId}`,
)
</script>

<template>
  <UiCard title="View Project">
    <template #content>
      <UiCardContent>
        <pre>{{ project }}</pre>
      </UiCardContent>
    </template>
  </UiCard>
</template>
