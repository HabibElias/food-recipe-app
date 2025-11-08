<script setup lang="ts">
const { recipe } = defineProps<{
  recipe: {
    id: number;
    title: string;
    description: string;
    category: {
      id: number;
      category_name: string;
    };
    recipe_images: {
      id: number;
      img_url: string;
      is_thumbnail: boolean;
    }[];
    prep_time: number;
    recipe_ingredients_aggregate: {
      aggregate: {
        count: number;
      };
    };
  };
}>();
</script>

<template>
  <div
    class="card bg-base-100 shadow-sm"
  >
    <figure>
      <img
        :src="recipe.recipe_images[0]?.img_url || 'img/hero.jpg'"
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

      <div class="card-actions items-start md:items-center flex-col justify-between md:flex-row">
        <div class="font-small-text mb-2 md:mb-0">
          {{ recipe.prep_time }} min - {{ recipe.recipe_ingredients_aggregate.aggregate.count }} INGREDIENTS
        </div>
        <nuxt-link :to="`/recipes/${recipe.id}`" class="btn btn-outline rounded-full self-end w-full md:w-fit">
          VIEW RECIPE
        </nuxt-link>
      </div>
    </div>
  </div>
</template>
