<script setup>
import consola from "consola"

const route = useRoute()
const status = ref("")

definePageMeta({
  layout: "login",
})
setTimeout(async () => {
  if (!route.query.code) {
    status.value = "getting-code"
    consola.info(route)
    navigateTo(`${useRuntimeConfig().public.OAUTH_URL}/api/oauth2/authorize?client_id=testpoint2&redirect_uri=http://${useRuntimeConfig().public.APP_URL}${route.fullPath}&response_type=code`, {
      external: true,
    })
  }
  else {
    if (route.query.code) {
      status.value = "Loading ..... getting-token"
      await useFetch("/api/auth", {
        method: "POST",
        body: {
          code: route.query.code,
        },
      })
      status.value = "Loading ..... getting-profile"
      await useFetch("/api/auth")
      status.value = "Loading ..... completed. Navigating to source!"
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
  </div>
</template>
