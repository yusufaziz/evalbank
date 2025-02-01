/**
 * @brief Defines a store for managing current application state.
 *
 * @module currentStore
 */
import { defineStore } from "pinia"

export const useCurrentStore = defineStore("current", {
  /**
   * @brief Initializes the state of the store.
   *
   * @returns {object} The initial state of the store.
   */
  state: () => {
    return {
      activeProjectsId: "", // ID of the currently active project
      breadcrumbItems: [], // Array of breadcrumb items
    }
  },
})
