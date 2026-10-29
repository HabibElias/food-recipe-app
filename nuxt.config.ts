import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },

  runtimeConfig: {
    public: {
      graphqlHttpEndpoint: "http://localhost:8080/v1/graphql",
      graphqlWsEndpoint: "ws://localhost:8080/v1/graphql",
    },
  },

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
    preference: "light",
    fallback: "light",
  },
  css: ["~/assets/css/main.css", "~/assets/css/motion.css"],
  eslint: {
    config: {
      standalone: false,
    },
  },
  fonts: {
    providers: { google: false, googleicons: false, bunny: false, fontshare: false, fontsource: false, adobe: false },
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
    pageTransition: { name: "bowlup-page", mode: "out-in" },
    head: {
      title: "Bowlup — Cook something good tonight",
      meta: [
        { charset: "utf-8" },
        { name: "viewport", content: "width=device-width, initial-scale=1" },
      ],
      link: [
        { rel: "icon", type: "image/svg+xml", href: "/brand/bowlup-app-icon-orange.svg" },
        { rel: "apple-touch-icon", href: "/brand/bowlup-app-icon-orange-180.png" },
        { rel: "preload", href: "/fonts/Outfit.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
        { rel: "preload", href: "/fonts/DM-Sans.woff2", as: "font", type: "font/woff2", crossorigin: "anonymous" },
      ],
    },
  },
});
