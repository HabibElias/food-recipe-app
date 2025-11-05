import { useUserStore } from "~/stores/user";

export default defineNuxtPlugin((nuxtApp) => {
  const userStore = useUserStore();

  nuxtApp.hook("apollo:auth", async ({ token }) => {
    if (userStore.token) {
      token.value = userStore.token;
    }
    else {
      token.value = null;
    }
  });
});
