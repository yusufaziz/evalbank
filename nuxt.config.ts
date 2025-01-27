import process from "node:process"

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
      script: [],
    },
  },

  colorMode: {
    classSuffix: "",
  },
  runtimeConfig: {
    public: {
      APP_TITLE: process.env.APP_TITLE ? process.env.APP_TITLE : `Evalbank`,
      APP_DESCRIPTION: process.env.APP_DESCRIPTION ? process.env.APP_DESCRIPTION : `Effective evaluation.`,
    },
  },

  build: {
    transpile: ["vue-sonner"],
  },

  future: {
    compatibilityVersion: 4,
  },
  compatibilityDate: "2024-11-01",

  nitro: {
    experimental: {
      tasks: true,
    },
  },

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

  fonts: {
    providers: {
      google: false,
      adobe: false,
      fontsource: false,
      bunny: false,
      fontshare: false,
      googleicons: false,
    },
  },

  tailwindcss: {
    exposeConfig: true,
    editorSupport: true,
  },
})
