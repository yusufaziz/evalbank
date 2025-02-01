import type { ComputedRef, Ref } from "vue"
import { createContext } from "radix-vue"

/**
 * @brief Constants and utilities for managing the sidebar state and styles.
 *
 * @module sidebarUtils
 */
export const SIDEBAR_COOKIE_NAME = "sidebar:state"
export const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7 // 7 days in seconds
export const SIDEBAR_WIDTH = "16rem"
export const SIDEBAR_WIDTH_MOBILE = "18rem"
export const SIDEBAR_WIDTH_ICON = "3rem"
export const SIDEBAR_KEYBOARD_SHORTCUT = "b"

/**
 * @brief Creates reusable styles for sidebar menu buttons.
 *
 * @returns {Function} A Tailwind Variants function for generating sidebar menu button styles.
 */
export const sidebarMenuButtonVariants = tv({
  base: "peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0",
  variants: {
    variant: {
      default: "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
      outline:
        "bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]",
    },
    size: {
      default: "h-8 text-sm",
      sm: "h-7 text-xs",
      lg: "h-12 text-sm group-data-[collapsible=icon]:!p-0",
    },
  },
  defaultVariants: {
    variant: "default",
    size: "default",
  },
})

/**
 * @typedef {object} SidebarContext
 * @property {ComputedRef<"expanded" | "collapsed">} state - The current state of the sidebar.
 * @property {Ref<boolean>} open - Whether the sidebar is open.
 * @property {Function} setOpen - Function to set the sidebar's open state.
 * @property {Ref<boolean>} isMobile - Whether the sidebar is in mobile mode.
 * @property {Ref<boolean>} openMobile - Whether the mobile sidebar is open.
 * @property {Function} setOpenMobile - Function to set the mobile sidebar's open state.
 * @property {Function} toggleSidebar - Function to toggle the sidebar's state.
 */

/**
 * @brief Creates a context for managing the sidebar state.
 *
 * @returns {[Function, Function]} A tuple containing the `useSidebar` hook and `provideSidebarContext` function.
 */
export const [useSidebar, provideSidebarContext] = createContext<{
  state: ComputedRef<"expanded" | "collapsed">
  open: Ref<boolean>
  setOpen: (value: boolean) => void
  isMobile: Ref<boolean>
  openMobile: Ref<boolean>
  setOpenMobile: (value: boolean) => void
  toggleSidebar: () => void
}>("Sidebar")
