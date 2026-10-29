<script setup lang="ts">
definePageMeta({middleware:["auth"],requiresAuth:true});
const store=useBookmarksStore();
onMounted(()=>store.loadBookmarks());
useSeoMeta({title:"Saved recipes — Bowlup"});
</script>
<template>
 <section style="padding-bottom:64px"><header class="page-heading"><h1>Worth making again.</h1><p>A recipe book filled with your favorites.</p></header>
  <div v-if="store.loading" class="skeleton-grid" aria-label="Loading saved recipes"><div v-for="i in 3" :key="i" class="recipe-skeleton" /></div>
  <div v-else-if="store.bookmarks.length" class="recipe-grid"><AppRecipeCard v-for="entry in store.bookmarks" :key="entry.id" :recipe="entry.recipe" bookmark :bookmark-id="entry.id" /></div>
  <div v-else class="empty-state"><Icon name="lucide:bookmark" size="30" /><h2>A little inspiration for later.</h2><p>Tap the bookmark on a recipe you love. We'll keep it here for you.</p><NuxtLink to="/browse" class="btn btn-primary">Find something good <Icon name="lucide:arrow-right" size="16" /></NuxtLink></div>
 </section>
</template>
