<script setup lang="ts">
const userStore = useUserStore();
const bookmarks = useBookmarksStore();
onMounted(() => { if (userStore.isLoggedIn) bookmarks.loadBookmarks(); });
watch(() => userStore.isLoggedIn, (loggedIn) => { if (loggedIn) bookmarks.loadBookmarks(); else bookmarks.bookmarks = []; });
const route = useRoute();
const menuOpen = ref(false);
watch(() => route.fullPath, () => { menuOpen.value = false; });
const nav = computed(() => route.path === "/"
 ? [{label:"How it works",to:"/#how-it-works"},{label:"Your kitchen",to:"/#your-kitchen"},{label:"Recipes",to:"/browse"},{label:"Meet Habib",to:"/#our-kitchen"}]
 : [{label:"Recipes",to:"/browse"},{label:"Saved recipes",to:"/bookmarks"},{label:"Cooking tips",to:"/cooking-tips"}]);
function active(path: string) { return path.startsWith("/#") ? route.hash === path.slice(1) ? "location" : undefined : route.path.startsWith(path) ? "page" : undefined; }
</script>
<template>
 <header class="site-header" @keydown.esc="menuOpen = false">
  <div class="site-frame header-row">
   <NuxtLink to="/" class="brand-link" aria-label="Bowlup home"><img src="/brand/bowlup-logo-horizontal-orange.svg" class="brand-logo" width="142" height="47" alt="Bowlup"></NuxtLink>
   <nav class="desktop-nav" aria-label="Main navigation"><NuxtLink v-for="item in nav" :key="item.to" :to="item.to" :aria-current="active(item.to)">{{ item.label }}</NuxtLink></nav>
   <div class="header-actions">
    <NuxtLink v-if="userStore.isLoggedIn" to="/notifications" class="icon-button" aria-label="Notifications"><Icon name="lucide:bell" size="20" /></NuxtLink>
    <details v-if="userStore.isLoggedIn" class="account-menu"><summary aria-label="Your account">{{ (userStore.user?.FirstName || userStore.user?.username || "You").slice(0,1).toUpperCase() }}</summary><nav aria-label="Your account"><NuxtLink to="/profile">Your profile</NuxtLink><NuxtLink to="/myrecipes">Your recipes</NuxtLink><NuxtLink to="/recipes/add">Create a recipe</NuxtLink><NuxtLink to="/bookmarks">Saved recipes</NuxtLink><button type="button" @click="userStore.logout()">Sign out</button></nav></details>
    <NuxtLink v-else to="/auth/login" class="btn btn-outline desktop-signin">Sign in <Icon name="lucide:arrow-up-right" size="16" /></NuxtLink>
    <button class="icon-button menu-toggle" type="button" :aria-expanded="menuOpen" aria-controls="mobile-navigation" :aria-label="menuOpen ? 'Close navigation' : 'Open navigation'" @click="menuOpen = !menuOpen"><Icon :name="menuOpen ? 'lucide:x' : 'lucide:menu'" size="24" /></button>
   </div>
  </div>
  <Transition name="mobile-menu"><nav v-if="menuOpen" id="mobile-navigation" class="mobile-nav" aria-label="Mobile navigation"><NuxtLink v-for="item in nav" :key="item.to" :to="item.to" :aria-current="active(item.to)">{{ item.label }}</NuxtLink><NuxtLink to="/recipes/add">Create a recipe</NuxtLink><NuxtLink to="/about-us">Our kitchen</NuxtLink><NuxtLink v-if="!userStore.isLoggedIn" to="/auth/login">Sign in</NuxtLink></nav></Transition>
 </header>
</template>
