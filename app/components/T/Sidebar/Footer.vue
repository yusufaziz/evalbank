<script setup lang="ts">
/**
 * @brief Component for rendering the footer section of the sidebar.
 * @details This component displays user information and provides dropdown options for account management.
 */
const props = defineProps({
  /**
   * The current state of the sidebar (e.g., expanded or collapsed).
   */
  state: {
    type: String,
    required: true,
  },
  /**
   * Whether the sidebar is displayed on a mobile device.
   */
  isMobile: {
    type: Boolean,
    required: true,
  },
})

/**
 * @brief User data object containing name, email, and avatar URL.
 */
const userData = {
  name: "breezy",
  email: "m@example.com",
  avatar: "https://behonbaker.com/icon.png",
}
</script>

<template>
  <UiSidebarFooter>
    <UiSidebarMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenu>
          <!-- Dropdown Trigger -->
          <UiDropdownMenuTrigger as-child>
            <UiSidebarMenuButton
              size="lg"
              class="data-[props.state=open]:bg-sidebar-accent data-[props.state=open]:text-sidebar-accent-foreground"
            >
              <!-- Avatar -->
              <UiAvatar class="size-8 rounded-lg">
                <UiAvatarFallback class="rounded-lg">
                  BB
                </UiAvatarFallback>
              </UiAvatar>
              <!-- User Information -->
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userData.name }}</span>
                <span class="truncate text-xs">{{ userData.email }}</span>
              </div>
              <!-- Chevron Icon -->
              <Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
            </UiSidebarMenuButton>
          </UiDropdownMenuTrigger>

          <!-- Dropdown Content -->
          <UiDropdownMenuContent
            class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            :side="props.isMobile ? 'bottom' : 'right'"
            :side-offset="4"
            align="end"
          >
            <!-- User Profile Label -->
            <UiDropdownMenuLabel class="p-0 font-normal">
              <div class="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
                <UiAvatar class="size-8 rounded-lg">
                  <UiAvatarImage :src="userData.avatar" :alt="userData.name" />
                  <UiAvatarFallback class="rounded-lg">
                    BB
                  </UiAvatarFallback>
                </UiAvatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ userData.name }}</span>
                  <span class="truncate text-xs">{{ userData.email }}</span>
                </div>
              </div>
            </UiDropdownMenuLabel>
            <UiDropdownMenuSeparator />

            <!-- Upgrade Section -->
            <UiDropdownMenuGroup>
              <UiDropdownMenuItem icon="lucide:sparkles" title="Upgrade to Pro" />
            </UiDropdownMenuGroup>
            <UiDropdownMenuSeparator />

            <!-- Theme and Settings Section -->
            <UiDropdownMenuGroup>
              <UiDropdownMenuItem
                icon="lucide:sun"
                title="Light Theme"
                @click="useColorMode().preference = 'light'"
              />
              <UiDropdownMenuItem
                icon="lucide:moon"
                title="Dark Theme"
                @click="useColorMode().preference = 'dark'"
              />
              <UiDropdownMenuItem icon="lucide:settings-2" title="Settings" />
              <UiDropdownMenuItem icon="lucide:bell" title="Notifications" />
            </UiDropdownMenuGroup>
            <UiDropdownMenuSeparator />

            <!-- Logout Option -->
            <UiDropdownMenuItem icon="lucide:log-out" title="Log out" />
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>
  </UiSidebarFooter>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
