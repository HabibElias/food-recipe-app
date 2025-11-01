<script setup lang="ts">
const route = useRoute();

const routes: [string, string, [string, string][]][] = [
  ["Home", "/", []],
  ["Recipes", "/recipes", [
    ["Breakfast", "/recipes/breakfast"],
    ["Lunch", "/recipes/lunch"],
    ["Dinner", "/recipes/dinner"],
    ["Dessert", "/recipes/dessert"],
    ["Snacks", "/recipes/snacks"],
  ]],
  ["Cooking Tips", "/cooking-tips", []],
  ["About us", "/about-us", []],
];
</script>

<template>
  <header class="my-4 flex border items-center border-base-content/50 rounded-full p-4 item-center justify-between">
    <!-- logo -->
    <div class="font-bold">
      <span class="bg-primary p-3 px-4 text-white rounded-full">R</span>
      Recipe
    </div>

    <!-- nav -->
    <nav class="hidden md:block">
      <div class="flex items-center gap-3 text-sm font-semibold">
        <div
          v-for="value in routes"
          :key="value[1]"
          :class="route.fullPath === value[1] ? 'duration-200 border-b-3 border-b-primary hover:border-b-amber-700' : 'duration-200 border-b-3 border-b-transparent hover:border-b-amber-700'"
        >
          <nuxt-link
            :to="value[1]"
          >
            {{ !(value[2].length > 0) ? value[0].toUpperCase() : "" }}
          </nuxt-link>
          <div v-if="value[2].length > 0" class="dropdown dropdown-hover p-0">
            <div
              tabindex="0" role="link" class=""
            >
              {{ value[0].toUpperCase() }}
            </div>
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
      <button class="btn rounded-full p-3">
        <icon name="lucide:user-round" />
      </button>
    </div>

    <div class="flex-none md:hidden">
      <label for="my-drawer-2" aria-label="open sidebar" class="btn btn-circle">
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
