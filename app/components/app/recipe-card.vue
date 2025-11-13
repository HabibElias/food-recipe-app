<script setup lang="ts">
const { recipe } = defineProps<{ recipe: Recipe }>();
</script>

<template>
  <div
    class="card bg-base-100 shadow-sm"
  >
    <figure>
      <img
        :src="recipe.recipe_images[0]?.img_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfxv5az0MMNH2ObMut8Ie5yh9nYUTr3H7zLQ&s'"
        :alt="recipe.title"
        class="object-cover md:h-70 lg:h-100 w-full"
      >
    </figure>
    <div class="card-body">
      <div class="flex items-center justify-between w-full">
        <h2 class="card-title font-header-3">
          {{ recipe.title }}
        </h2>
        <p class="font-small-text text-end">
          {{ recipe.category.category_name }}
        </p>
      </div>
      <p class="font-paragraph-2">
        {{ recipe.description }}
      </p>

      <div class="flex items-center border border-base-content/50 rounded-full px-4 my-4">
        <p class="font-paragraph-2">
          Avg Rating:
        </p>
        <app-star-rating :value="recipe.recipe_ratings_aggregate.aggregate.avg.rating" readonly />
      </div>

      <div class="card-actions items-start md:items-center flex-col justify-between md:flex-row">
        <div v-if="!recipe.is_paid" class="font-small-text mb-2 md:mb-0">
          {{ recipe.prep_time }} min - {{ recipe.recipe_ingredients_aggregate.aggregate.count }} INGREDIENTS
        </div>
        <div v-else class="badge badge-success font-button-text">
          PAID
        </div>
        <nuxt-link :to="`/recipes/${recipe.id}`" class="btn btn-outline rounded-full self-end w-full md:w-fit">
          VIEW RECIPE
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
