<script setup lang="ts">
const { recipe, bookmark, bookmarkId } = defineProps<{ recipe: Recipe; bookmark?: boolean; bookmarkId?: number }>();

const loadingInsertBookmark = ref<boolean>(false);
const bookmarked = ref<boolean>(Boolean(bookmark));

const toast = useToast();
const { deleteBookmark, bookmarkRecipe, loadRecipes } = useBookmarks();

// ensure initial bookmarked state is derived from prop
if (bookmark) {
  bookmarked.value = true;
}

async function bookmarkFn(id: number | undefined, recipe_id: number) {
  if (!useUserStore().isLoggedIn) {
    toast.info({ message: "Log In to Bookmark a recipe" });
    return;
  }
  loadingInsertBookmark.value = true;
  try {
    if (bookmarked.value) {
      if (id) {
        await deleteBookmark(id);
      }
      else {
        await loadRecipes();
      }
      bookmarked.value = false;
    }
    else {
      await bookmarkRecipe(recipe_id);
      bookmarked.value = true;
    }
  }
  finally {
    loadingInsertBookmark.value = false;
  }
}
</script>

<template>
  <div
    class="card bg-base-100 shadow-sm"
  >
    <figure>
      <img
        :src="recipe.recipe_images?.[0]?.img_url || 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQfxv5az0MMNH2ObMut8Ie5yh9nYUTr3H7zLQ&s'"
        :alt="recipe.title || 'recipe'"
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

      <div class="flex items-center justify-start border-border-base-content/50 rounded-full my-4">
        <!-- <p class="font-paragraph-2">
          Avg Rating:
        </p> -->
        <app-star-rating :value="recipe.recipe_ratings_aggregate?.aggregate?.avg?.rating ?? 0" readonly />
      </div>

      <div class="card-actions items-start md:items-center flex-col justify-between md:flex-row">
        <div v-if="!recipe.is_paid" class="font-small-text mb-2 md:mb-0">
          {{ recipe.prep_time ?? '-' }} min - {{ recipe.recipe_ingredients_aggregate?.aggregate?.count ?? 0 }} INGREDIENTS
        </div>
        <div v-else class="badge badge-success font-button-text">
          PAID
        </div>
        <div class="space-x-2">
          <div
            class="btn btn-outline btn-circle"
            @click="bookmarkFn(bookmarkId, recipe.id)"
          >
            <icon v-if="loadingInsertBookmark" name="lucide:loader-circle" class="animate-spin" />
            <icon v-else-if="bookmarked" name="lucide:trash" />
            <icon v-else name="lucide:bookmark" />
          </div>
          <nuxt-link :to="`/recipes/${recipe.id}`" class="btn btn-outline rounded-full self-end w-full md:w-fit">
            VIEW RECIPE
          </nuxt-link>
        </div>
      </div>
    </div>
  </div>
</template>
