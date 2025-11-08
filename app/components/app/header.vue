<script setup lang="ts">
const route = useRoute();

const userStore = useUserStore();

const isRouteLogin = computed(() => route.path === "/auth/login");

type RouteTuple = [string, string, Array<[string, string]>];

const recipeChildren: Array<[string, string]> = [
  ["Breakfast", "/recipes/breakfast"],
  ["Lunch", "/recipes/lunch"],
  ["Dinner", "/recipes/dinner"],
  ["Dessert", "/recipes/dessert"],
  ["Snacks", "/recipes/snacks"],
];

const commonRoutes: RouteTuple[] = [
  ["Home", "/", []],
  ["Recipes", "/recipes", recipeChildren],
  ["About us", "/about-us", []],
];

const loggedRoutes: RouteTuple[] = [
  ["My Recipes", "/myrecipes", []],
  ["Recipes", "/recipes", recipeChildren],
  ["About us", "/about-us", []],
];

const routes = computed<RouteTuple[]>(() => {
  // return a fresh shallow copy to keep the source immutable for consumers
  return userStore.isLoggedIn ? loggedRoutes.map(([label, path, children]) => [label, path, children]) : commonRoutes.map(([label, path, children]) => [label, path, children]);
});
</script>

<template>
  <header class="my-4 flex border items-center border-base-content/50 rounded-full p-4 item-center justify-between">
    <!-- logo -->
    <nuxt-link to="/" class="font-bold">
      <span class="bg-primary p-3 px-4 text-white rounded-full">R</span>
      Recipe
    </nuxt-link>

    <!-- nav -->
    <nav class="hidden md:block">
      <div class="flex items-center gap-3 text-sm font-semibold">
        <div
          v-for="value in routes"
          :key="value[1]"
          :class="route.fullPath === value[1] ? 'duration-200 border-b-3 border-b-primary hover:border-b-amber-700' : 'duration-200 border-b-3 border-b-transparent hover:border-b-amber-700'"
        >
          <nuxt-link
            v-if="!(value[2].length > 0)"
            :to="value[1]"
          >
            {{ value[0].toUpperCase() }}
          </nuxt-link>
          <div v-if="value[2].length > 0" class="dropdown dropdown-hover p-0">
            <nuxt-link
              :to="value[1]"
              class="cursor-pointer"
            >
              {{ value[0].toUpperCase() }}
            </nuxt-link>
            <ul tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-1 w-52 p-2 shadow-sm">
              <li v-for="subValue in value[2]" :key="subValue[1]">
                <nuxt-link :to="subValue[1]">
                  {{ subValue[0].toUpperCase() }}
                </nuxt-link>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>

    <div class="items-center gap-3 hidden md:flex">
      <color-mode />
      <div v-cloak v-if="!userStore.isLoggedIn">
        <nuxt-link v-if="!isRouteLogin" to="/auth/login" class="btn btn-outline rounded-full">
          <icon name="lucide:mail" />
          Login
        </nuxt-link>
        <nuxt-link v-else to="/auth/sign-up" class="btn btn-outline rounded-full">
          <icon name="lucide:mail-plus" />
          Sign up
        </nuxt-link>
      </div>
      <div v-cloak v-else>
        <nuxt-link to="/auth/log-out" class="btn btn-outline rounded-full btn-primary">
          <icon name="lucide:log-out" />
          Logout
        </nuxt-link>
      </div>
    </div>

    <div class="flex-none md:hidden">
      <label for="my-drawer-2" aria-label="open sidebar" class="btn btn-circle btn-outline">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          class="inline-block h-6 w-6 stroke-current"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
      </label>
    </div>
  </header>
</template>
