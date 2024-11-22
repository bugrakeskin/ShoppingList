// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/icon", "@nuxtjs/supabase"],
  supabase: {
    redirect: false,
  },
  runtimeConfig: {
    public: {
      baseurl: process.env.BASE_URL ?? "http://localhost:3000",
    },
  },
  ui: {},
});
