export function useAuth() {
  const cookie = useCookie<string>(useRuntimeConfig().public.AUTH_COOKIE) || ""
  const setData = async () => {
    const route = useRoute()
    if (route.query.code) {
      const userId = atob(atob(route.query.code.toString())).split(":")[1]
      const { data: userData } = await useFetch<any>(`${useRuntimeConfig().public.OAUTH_PROFILE_URL}?id=${userId}`)
      if (userData && userData.value[0]) {
        cookie.value = `${userData.value[0].id}|${userData.value[0].name}|${userData.value[0].code}|${userData.value[0].email}|${userData.value[0].dept.longName}`
      }
    }
  }
  const id = computed(() => {
    if (!useRuntimeConfig().public.AUTH_COOKIE) {
      return "user-id"
    }
    return cookie.value.split("|")[0] || ""
  })
  const username = computed(() => {
    if (!useRuntimeConfig().public.AUTH_COOKIE) {
      return "user-name"
    }
    return cookie.value.split("|")[1] || ""
  })
  const code = computed(() => {
    if (!useRuntimeConfig().public.AUTH_COOKIE) {
      return "user-code"
    }
    return cookie.value.split("|")[2] || ""
  })
  const email = computed(() => {
    if (!useRuntimeConfig().public.AUTH_COOKIE) {
      return "user-mail"
    }
    return cookie.value.split("|")[3] || ""
  })
  const dept = computed(() => {
    if (!useRuntimeConfig().public.AUTH_COOKIE) {
      return "user-dept"
    }
    return cookie.value.split("|")[4] || ""
  })
  const avatar = computed(() => {
    const words = username.value.split(" ") || []
    const firstChars = words.map(word => word.charAt(0).toUpperCase())
    const result = firstChars.slice(0, 2).join("")
    return result
  })

  return {
    setData,
    id,
    username,
    code,
    email,
    dept,
    avatar,
  }
}
