import consola from "consola"

export default defineNuxtRouteMiddleware((_to, _from) => {
  if (_from.meta.layout !== "login" && _to.path !== "/login") {
    const cookie: any = useCookie("auth") || ""
    if (!cookie.value) {
      return navigateTo(`/login?source=${_from.fullPath}`, {
        open: {
          target: "_self",
        },
      })
    }
  }
})
