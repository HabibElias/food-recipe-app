<script setup lang="ts">
import HomeRecipes from "~~/server/_queries/HomeRecipeNotLoggedIn.gql";
import SignedInRecipes from "~~/server/_queries/HomeRecipeQuery.gql";
const user = useUserStore();
const recipes = ref<Recipe[]>([]);
const category = ref("All recipes");
const search = ref("");
const loadError = ref(false);
const categories = ["All recipes", "Breakfast", "Lunch", "Dinner", "Dessert", "Snacks"];
const filtered = computed(() => recipes.value.filter(recipe => category.value === "All recipes" || recipe.category?.category_name === category.value));
const featured = computed(() => recipes.value.find(recipe => recipe.title.toLowerCase().includes("shiro")) || recipes.value[0]);
async function load() {
 loadError.value = false;
 try { const { data } = await useApolloClient().client.query({ query: user.isLoggedIn ? SignedInRecipes : HomeRecipes, variables: { limit: 24, user_id: user.user?.id }, fetchPolicy: "network-only" }); recipes.value = data.recipe || []; }
 catch { loadError.value = true; }
}
function findRecipe() { navigateTo({ path: "/browse", query: search.value.trim() ? { search: search.value.trim() } : {} }); }
await load();
useSeoMeta({ title: "Bowlup — Cook something good tonight", description: "Find a recipe you'll actually want to make. Save your favorites and cook with clear, friendly steps." });
</script>
<template>
 <div>
  <section class="discovery-hero" aria-labelledby="home-title">
   <div class="hero-copy"><h1 id="home-title">Cook something<br>good tonight.</h1><p>A little inspiration for your everyday cooking. Find a recipe you love, make it your own, and come back for seconds.</p><a class="btn btn-primary" href="#recipes">Find your next meal <Icon name="lucide:arrow-down-right" size="18" /></a></div>
   <div><NuxtLink :to="featured ? '/recipes/' + featured.id : '/browse'" class="hero-photo" aria-label="Try our warm chickpea stew"><img src="/images/recipes/shiro.webp" alt="Ethiopian shiro served on injera with a fresh salad" width="680" height="540" fetchpriority="high"></NuxtLink><NuxtLink v-if="featured" :to="'/recipes/' + featured.id" class="hero-recipe-link"><div><strong>{{ featured.title }}</strong><span>{{ featured.prep_time }} min · A little comfort from the kitchen</span></div><Icon name="lucide:arrow-up-right" size="24" /></NuxtLink></div>
  </section>
  <section id="recipes" class="recipe-discovery" aria-labelledby="recipes-title">
   <div class="section-heading"><div><h2 id="recipes-title">Something for every appetite.</h2><p>Simple favorites, new discoveries, and plenty of good food.</p></div><NuxtLink to="/browse" class="text-link">All recipes <Icon name="lucide:arrow-up-right" size="16" /></NuxtLink></div>
   <div class="discovery-toolbar"><div class="category-tabs" aria-label="Recipe categories"><button v-for="item in categories" :key="item" type="button" class="category-tab" :aria-pressed="category === item" @click="category = item">{{ item }}</button></div><form class="search-field" role="search" @submit.prevent="findRecipe"><Icon name="lucide:search" size="18" /><input v-model="search" aria-label="Search recipes" placeholder="What are you craving?" type="search"><button type="submit" aria-label="Find recipes"><Icon name="lucide:arrow-right" size="18" /></button></form></div>
   <div v-if="loadError" class="empty-state" role="status"><h3>A little pause in the kitchen.</h3><p>We couldn't load the recipes. Let's try again.</p><button type="button" class="btn btn-outline" @click="load">Try again</button></div>
   <TransitionGroup v-else-if="filtered.length" name="recipe-list" tag="div" class="recipe-grid"><AppRecipeCard v-for="(recipe,index) in filtered.slice(0,9)" :key="recipe.id" :recipe="recipe" :motion-index="index" /></TransitionGroup>
   <div v-else class="empty-state"><h3>Something good is on its way.</h3><p>Explore the other categories while this kitchen warms up.</p><button type="button" class="btn btn-outline" @click="category = 'All recipes'">See all recipes</button></div>
  </section>
  <section class="kitchen-note" aria-labelledby="kitchen-title"><h2 id="kitchen-title">Your next favorite starts here.</h2><div><p>Keep the recipes you want to make again. Share the ones that feel like home. There's always room at the table.</p><NuxtLink :to="user.isLoggedIn ? '/recipes/add' : '/auth/sign-up'" class="text-link">{{ user.isLoggedIn ? "Share a recipe" : "Make yourself at home" }} <Icon name="lucide:arrow-up-right" size="18" /></NuxtLink></div></section>
 </div>
</template>
