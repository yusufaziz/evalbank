<script setup>
import consola from "consola"

const route = useRoute()
const status = ref("")

definePageMeta({
  layout: "login",
})
onMounted(() => {
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
        useAuth().setData()
        status.value = "Validation Sucess. Return to original pages ..."
        if (route.query.source) {
          useRouter().push(route.query.source)
        }
      }
    }
  }, 500)
})
</script>

<template>
  <span>
    {{ status }}
  </span>
</template>
