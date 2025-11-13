import { useUserStore } from "~/stores/user";

export default defineNuxtRouteMiddleware(async (to) => {
  const userStore = useUserStore();

  // Ensure the store runs its initialization before deciding whether to redirect.
  // If initialization is already running or completed, init() will return quickly.
  if (!userStore.isInitialized) {
    try {
      await userStore.init();
    }
    catch {
      // ignore init errors here; store reset state already
    }
  }

  // If route requires auth and user is not logged in (and init finished), redirect to login.
  if (to.meta.requiresAuth && !userStore.isLoggedIn && !userStore.isLoading) {
    return navigateTo("/auth/login");
  }
});
