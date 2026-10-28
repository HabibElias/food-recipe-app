import { NuxtApollo } from "#apollo";

export default defineNuxtPlugin({
  name: "apollo-endpoints",
  enforce: "pre",
  setup() {
    const config = useRuntimeConfig();

    // The Apollo module otherwise embeds its endpoint settings during the build.
    NuxtApollo.clients.default.httpEndpoint = config.public.graphqlHttpEndpoint;
    NuxtApollo.clients.default.wsEndpoint = config.public.graphqlWsEndpoint;
  },
});
