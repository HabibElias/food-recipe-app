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
  ["Notification", "/notifications", []],
  ["About us", "/about-us", []],
];

const routes = computed<RouteTuple[]>(() => {
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

    <div class="items-center gap-5 hidden md:flex">
      <nuxt-link to="/browse">
        <icon name="lucide:search" size="28" class="mt-1" />
      </nuxt-link>
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
      <div v-else class="dropdown dropdown-bottom dropdown-center">
        <div v-if="userStore.user?.avatar_url" tabindex="0" class="avatar cursor-pointer">
          <div class="w-12 rounded">
            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp">
          </div>
        </div>
        <div v-else tabindex="0" class="avatar avatar-placeholder h-fit cursor-pointer">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span class="text-xl">{{ userStore.user?.FirstName.slice(0, 1).toUpperCase() }}</span>
          </div>
        </div>
        <div tabindex="-1" class="dropdown-content menu bg-base-100 rounded-box z-10 w-60 p-3 shadow-sm space-y-1 divide-y divide-base-200">
          <div class="px-2 pb-2">
            <div class="font-semibold text-sm leading-snug">
              {{ userStore.user?.FirstName || userStore.user?.username || 'User' }}
            </div>
            <div class="text-xs opacity-80 truncate">
              {{ userStore.user?.email }}
            </div>
          </div>

          <div v-if="userStore.isLoggedIn" class="py-2 flex flex-col gap-2">
            <nuxt-link to="/profile" class="block px-3 py-2 rounded hover:bg-base-200">
              Profile
            </nuxt-link>
            <nuxt-link to="/myrecipes" class="block px-3 py-2 rounded hover:bg-base-200">
              My Recipes
            </nuxt-link>
            <nuxt-link to="/bookmarks" class="block px-3 py-2 rounded hover:bg-base-200">
              Bookmarks
            </nuxt-link>
          </div>

          <div class="px-3 py-2">
            <button
              v-if="userStore.isLoggedIn"
              class="btn btn-outline btn-error w-full rounded-full"
              @click="userStore.logout()"
            >
              <icon name="lucide:log-out" />
              Logout
            </button>

            <nuxt-link
              v-else
              to="/auth/login"
              class="btn btn-outline btn-sm w-full rounded-full text-center"
            >
              Login
            </nuxt-link>
          </div>
        </div>
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
