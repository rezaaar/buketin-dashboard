// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  ssr: false,
  modules: ["@nuxt/ui"],
  runtimeConfig: {
    public: {
      API_BASE: 'http://www.buketinapi.rezaaar.my.id/' || 'http://localhost:3030/'
    }
  }
});
