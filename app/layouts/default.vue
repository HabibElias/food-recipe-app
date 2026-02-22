<script setup lang="ts">
import type { RouteTuple } from "~~/shared/types/routes";

const userStore = useUserStore();

await userStore.init();

const routes = computed<RouteTuple[]>(() => {
  return userStore.isLoggedIn ? loggedRoutes.map(([label, path, children]) => [label, path, children]) : commonRoutes.map(([label, path, children]) => [label, path, children]);
});
</script>

<template>
  <div class="drawer font-[Onest] container mx-auto px-2 scroll-smooth">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle">
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <AppHeader />
      <!-- Page content here -->
      <div>
        <NuxtPage />
      </div>
      <AppFooter with-subscribe />
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
      <ul class="menu bg-base-200 rounded-box w-56 h-full">
        <li class="menu-title flex items-center flex-row justify-between">
          <span>Navigation</span>
          <color-mode />
        </li>
        <li v-for="route in routes" :key="route[0]">
          <nuxt-link class="justify-between" :to="route[1]">
            {{ route[0] }}
          </nuxt-link>
          <ul v-if="route[2].length > 0">
            <li v-for="value in route[2]" :key="value[0]">
              <nuxt-link :to="value[1]">
                {{ value[0] }}
              </nuxt-link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  </div>
</template>
