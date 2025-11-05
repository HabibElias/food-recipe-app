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
        defaultOptions: {
          query: {
            context: {
              headers: {
                "X-Hasura-Role": "anon",
              },
            },
          },
          mutate: {
            context: {
              headers: {
                "X-Hasura-Role": "anon",
              },
            },
          },
        },
      },
    },
  },
});
