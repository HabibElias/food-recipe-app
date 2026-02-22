<script setup lang="ts">
const categories: { name: string; slug: string; icon: string }[] = [
  { name: "Breakfast", slug: "breakfast", icon: "/img/breakfast.svg" },
  { name: "Lunch", slug: "lunch", icon: "/img/lunch.svg" },
  { name: "Dinner", slug: "dinner", icon: "/img/dinner.svg" },
  { name: "Dessert", slug: "dessert", icon: "/img/dessert.svg" },
  { name: "Snacks", slug: "snacks", icon: "/img/quickbite.svg" },
];
</script>

<template>
  <div class="min-h-screen py-8 border border-base-content/50 rounded-4xl flex items-center">
    <div class="max-w-6xl mx-auto px-4">
      <div class="text-center mb-8">
        <div class="badge badge-primary font-button-text mb-3">
          CATEGORIES
        </div>
        <h1 class="font-headline-1">
          Explore Recipes by Category
        </h1>
        <p class="font-paragraph-2 text-base-content/70 mt-2">
          Pick a category to browse curated recipes.
        </p>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
        <nuxt-link
          v-for="cat in categories"
          :key="cat.slug"
          :to="`/recipes/${cat.slug}`"
          class="card card-xl bg-success border border-success text-success-content transition p-4 flex flex-col items-center justify-center text-center"
        >
          <img :src="cat.icon" :alt="cat.name" class="w-30 h-30 mb-3">
          <div class="font-subtitle">
            {{ cat.name }}
          </div>
        </nuxt-link>
      </div>

      <div class="mt-10 text-center">
        <nuxt-link to="/browse" class="btn btn-outline rounded-full font-button-text">
          Browse All Recipes
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
