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

const auth = useCookie<string>(useRuntimeConfig().public.AUTH_COOKIE) || ""
const userData = auth.value.split("|")
const userName = userData[1]
const userEmail = userData[3]
const avatar = computed(() => {
  const words = userName?.split(" ") || []
  // Extract the first character of each word
  const firstChars = words.map(word => word.charAt(0).toUpperCase())
  // Join the first characters and limit to a maximum of 2 characters
  const result = firstChars.slice(0, 2).join("")
  return result
})
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
                  {{ avatar }}
                </UiAvatarFallback>
              </UiAvatar>
              <!-- User Information -->
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userName }}</span>
                <span class="truncate text-xs">{{ userEmail }}</span>
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
                  <UiAvatarFallback class="rounded-lg">
                    {{ avatar }}
                  </UiAvatarFallback>
                </UiAvatar>
                <div class="grid flex-1 text-left text-sm leading-tight">
                  <span class="truncate font-semibold">{{ userName }}</span>
                  <span class="truncate text-xs">{{ userEmail }}</span>
                </div>
              </div>
            </UiDropdownMenuLabel>
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
