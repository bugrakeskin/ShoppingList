// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2024-04-03",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/icon", "@nuxtjs/supabase"],
  supabase: {
    redirect: false,
  },
  ui: {
    notifications: {
      position: "top-right", // Default position
      duration: 5000, // Notification duration in milliseconds
    },
  },
});
