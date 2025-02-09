<script lang="ts">
/**
 * @brief Root component of the application.
 * @details This component serves as the entry point for the application, managing layout, routing, and notifications.
 */
export default {
  name: "App",
}
</script>

<template>
  <div>
    <!-- Accessibility announcer for route changes -->
    <NuxtRouteAnnouncer />

    <!-- Loading indicator for asynchronous operations -->
    <NuxtLoadingIndicator />

    <!-- Layout wrapper for consistent page structure -->
    <NuxtLayout>
      <!-- Dynamic page content -->
      <NuxtPage />

      <!-- Notification component for user feedback -->
      <UiVueSonner />
    </NuxtLayout>
  </div>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
