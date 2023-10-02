// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: false },
  typescript: { strict: true },
  ssr: false,
  css: ['~/assets/css/main.css'],
  allowImportingTsExtensions: ['ts', 'vue']

})
