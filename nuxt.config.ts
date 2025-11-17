import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  modules: [
    "@nuxt/eslint",
    "@nuxt/fonts",
    "@nuxt/icon",
    "@nuxt/image",
    "@nuxtjs/apollo",
    "@nuxtjs/color-mode",
    "@pinia/nuxt",
    "nuxt-toast",
  ],
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  colorMode: {
    dataValue: "theme",
  },
  css: ["~/assets/css/main.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    defaults: {
      weights: [100, 200, 300, 400, 500, 600, 700, 800, 900],
    },
  },
  apollo: {
    clients: {
      default: {
        httpEndpoint: "http://localhost:8080/v1/graphql",
        wsEndpoint: "ws://localhost:8080/v1/graphql",
        tokenStorage: "cookie",
        tokenName: "apollo-token",
        authType: "Bearer",
        httpLinkOptions: {
          credentials: "include",
        },
      },
    },
  },
  app: {
    head: {
      title: "Food Recipe App",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/x-icon", href: "/favicon.ico" },
      ],
    },
  },
});
