<script setup lang="ts">
const userStore = useUserStore();

await userStore.init();
</script>

<template>
  <div class="drawer font-[Montserrat] container mx-auto px-2">
    <input id="my-drawer-2" type="checkbox" class="drawer-toggle">
    <div class="drawer-content flex flex-col">
      <!-- Navbar -->
      <AppHeader />
      <!-- Page content here -->
      <div>
        <slot />
      </div>
      <AppFooter />
    </div>
    <div class="drawer-side">
      <label for="my-drawer-2" aria-label="close sidebar" class="drawer-overlay" />
      <ul class="menu bg-base-200 rounded-box w-56 h-full">
        <li class="menu-title flex items-center flex-row justify-between">
          <span>Navigation</span>
          <color-mode />
        </li>
        <li>
          <NuxtLink to="/">
            Home
          </NuxtLink>
        </li>
        <li>
          <a class="justify-between">Recipes</a>
          <ul>
            <li>
              <NuxtLink to="/recipes/breakfast">
                Breakfast
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/recipes/lunch">
                Lunch
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/recipes/dinner">
                Dinner
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/recipes/dessert">
                Dessert
              </NuxtLink>
            </li>
            <li>
              <NuxtLink to="/recipes/snacks">
                Snacks
              </NuxtLink>
            </li>
          </ul>
        </li>
        <li>
          <NuxtLink to="/cooking-tips">
            Cooking Tips
          </NuxtLink>
        </li>
        <li>
          <NuxtLink to="/about-us">
            About us
          </NuxtLink>
        </li>
      </ul>
    </div>
  </div>
</template>
