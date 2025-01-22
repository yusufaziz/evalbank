<script setup lang="ts">
const props = defineProps({
  state: {
    type: String,
    required: true,
  },
  isMobile: {
    type: Boolean,
    required: true,
  },
})
const userData = {
  name: "breezy",
  email: "m@example.com",
  avatar: "https://behonbaker.com/icon.png",
}
const isDark = useDark()
</script>

<template>
  <UiSidebarFooter>
    <UiSidebarMenu>
      <UiSidebarMenuItem>
        <UiDropdownMenu>
          <UiDropdownMenuTrigger as-child>
            <UiSidebarMenuButton
              size="lg"
              class="data-[props.state=open]:bg-sidebar-accent data-[props.state=open]:text-sidebar-accent-foreground"
            >
              <UiAvatar class="size-8 rounded-lg">
                <UiAvatarFallback class="rounded-lg">
                  BB
                </UiAvatarFallback>
              </UiAvatar>
              <div class="grid flex-1 text-left text-sm leading-tight">
                <span class="truncate font-semibold">{{ userData.name }}</span>
                <span class="truncate text-xs">{{ userData.email }}</span>
              </div>
              <Icon name="lucide:chevrons-up-down" class="ml-auto size-4" />
            </UiSidebarMenuButton>
          </UiDropdownMenuTrigger>
          <UiDropdownMenuContent
            class="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            :side="props.isMobile ? 'bottom' : 'right'"
            :side-offset="4"
            align="end"
          >
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
            <UiDropdownMenuGroup>
              <UiDropdownMenuItem icon="lucide:sparkles" title="Upgrade to Pro" />
            </UiDropdownMenuGroup>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuGroup>
              <UiDropdownMenuItem
                icon="lucide:sun"
                title="Light Theme"
                @click="useToggle(isDark)"
              />
              <UiDropdownMenuItem
                icon="lucide:moon"
                title="Dark Theme"
                @click="useToggle(isDark)"
              />
              <UiDropdownMenuItem icon="lucide:settings-2" title="Settings" />
              <UiDropdownMenuItem icon="lucide:bell" title="Notifications" />
            </UiDropdownMenuGroup>
            <UiDropdownMenuSeparator />
            <UiDropdownMenuItem icon="lucide:log-out" title="Log out" />
          </UiDropdownMenuContent>
        </UiDropdownMenu>
      </UiSidebarMenuItem>
    </UiSidebarMenu>
  </UiSidebarFooter>
</template>
