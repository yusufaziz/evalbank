<template>
  <div>
    <h1>Projects</h1>
    <ul>
      <li v-for="project in projects" :key="project.id">
        {{ project.name }} - {{ project.author }}
      </li>
    </ul>
  </div>
</template>

<script lang="ts" setup>
  const { data: projects } = useFetch("/api/projects");
</script>
