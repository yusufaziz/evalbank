// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  modules: [
    "@nuxtjs/tailwindcss",
    "@nuxtjs/color-mode",
    "@vueuse/nuxt",
    "@nuxt/icon",
    "@nuxt/fonts",
    "@pinia/nuxt",
    "@vee-validate/nuxt",
    "@morev/vue-transitions/nuxt",
    "nuxt-seo-utils",
    "@nuxt/eslint",
  ],

  imports: {
    imports: [
      {
        from: "tailwind-variants",
        name: "tv",
      },
      {
        from: "tailwind-variants",
        name: "VariantProps",
        type: true,
      },
      {
        from: "vue-sonner",
        name: "toast",
        as: "useSonner",
      },
    ],
  },
  devtools: { enabled: true },

  app: {
    head: {
      script: [
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/pdfmake.min.js",
          defer: true,
        },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/pdfmake/0.2.12/vfs_fonts.min.js",
          defer: true,
        },
      ],
    },
  },

  colorMode: {
    classSuffix: "",
  },

  build: {
    transpile: ["vue-sonner"],
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-11-01",

  typescript: {
    strict: true,
  },

  telemetry: false,

  eslint: {
    config: {
      standalone: false,
      nuxt: {
        sortConfigKeys: true,
      },
    },
  },

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },
})
