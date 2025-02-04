module.exports = {
  apps: [
    {
      name: "testpoint",
      script: "./node_modules/nuxt/bin/nuxt.mjs",
      args: "start",
      watch: true,
    },
  ],
}
