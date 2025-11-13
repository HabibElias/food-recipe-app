<script setup lang="ts">
const props = defineProps<{ recipe: Recipe }>();

const emit = defineEmits<{
  delete: [id: number];
}>();

function handleDelete() {
  emit("delete", props.recipe.id);
}
</script>

<template>
  <div class="card bg-base-100 shadow-sm border border-base-300">
    <figure>
      <img
        :src="props.recipe.recipe_images[0]?.img_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfxv5az0MMNH2ObMut8Ie5yh9nYUTr3H7zLQ&s'"
        :alt="props.recipe.title"
        class="object-cover md:h-70 lg:h-100 w-full"
      >
    </figure>
    <div class="card-body">
      <div class="flex items-center justify-between w-full">
        <h2 class="card-title font-header-3">
          {{ props.recipe.title }}
        </h2>
        <p class="font-small-text text-end">
          {{ props.recipe.category.category_name }}
        </p>
      </div>
      <p class="font-paragraph-2 line-clamp-2">
        {{ props.recipe.description }}
      </p>

      <div class="card-actions items-start md:items-center flex-col justify-between md:flex-row">
        <div class="font-small-text mb-2 md:mb-0">
          {{ props.recipe.prep_time }} min - {{ props.recipe.recipe_ingredients_aggregate.aggregate.count }} INGREDIENTS
        </div>
        <div class="flex gap-2 self-end w-full md:w-fit">
          <nuxt-link :to="`myrecipes/edit/${props.recipe.id}`" class="btn btn-primary btn-outline rounded-full btn-circle tooltip tooltip-primary" data-tip="Edit">
            <icon name="lucide:edit" />
          </nuxt-link>
          <button class="btn btn-error btn-outline rounded-full tooltip tooltip-error btn-circle" data-tip="Delete" @click="handleDelete">
            <icon name="lucide:trash-2" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
