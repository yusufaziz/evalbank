<script setup>
import consola from "consola"

const route = useRoute()
const status = ref("")
const authData = ref()

definePageMeta({
  layout: "login",
})
setTimeout(async () => {
  if (!route.query.code) {
    status.value = "getting-code"
    consola.info(route)
    navigateTo(`${useRuntimeConfig().public.OAUTH_AUTHORIZE_URL}?client_id=testpoint2&redirect_uri=http://${useRuntimeConfig().public.APP_URL}${route.fullPath}&response_type=code`, {
      external: true,
    })
  }
  else {
    if (route.query.code) {
      status.value = "Validating profile ..."
      const userId = atob(atob(route.query.code.toString())).split(":")[1]
      const { data: userData } = await useFetch(`${useRuntimeConfig().public.OAUTH_PROFILE_URL}?id=${userId}`)
      const cookie = useCookie(useRuntimeConfig().public.AUTH_COOKIE) || ""
      cookie.value = `${userData.value[0].id}|${userData.value[0].name}|${userData.value[0].code}|${userData.value[0].email}|${userData.value[0].dept.longName}`
      status.value = "Validation Sucess. Return to original pages ..."
      if (route.query.source) {
        useRouter().push(route.query.source)
      }
    }
  }
}, 500)
</script>

<template>
  <div class="mx-a my-a">
    {{ status }}
    {{ authData }}
  </div>
</template>
