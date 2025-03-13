export default defineNuxtConfig({
  compatibilityDate: "2024-11-01",
  devtools: { enabled: true },

  srcDir: "src",

  css: ["~/assets/css/main.css"],

  components: {
    dirs: ["~/components", "~/features"],
  },

  runtimeConfig: {
    public: {
      apiBase: process.env.API_BASE_URL || "http://localhost:4000",
    },
  },

  ui: {
    theme: {
      colors: [
        "primary",
        "secondary",
        "tertiary",
        "info",
        "success",
        "warning",
        "error",
      ],
    },
  },

  modules: ["@nuxt/ui", "@pinia/nuxt", "vue-sonner/nuxt"],
});
