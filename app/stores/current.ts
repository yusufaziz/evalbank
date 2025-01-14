export const useCurrentStore = defineStore("current", {
  state: () => {
    return {
      activeProjectsId: "",
      breadcrumbItems: []
    };
  },
});
