<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true });
const store = useBookmarksStore();
onMounted(() => store.loadBookmarks());
</script>

<template>
  <div class="border border-base-content/50 rounded-4xl p-8">
    <div v-if="!store.isLoading">
      <div class="font-header-3 mb-6">
        Bookmarks
      </div>

      <div v-if="store.bookmarks && store.bookmarks.length" class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <app-recipe-card
          v-for="bookmark in store.bookmarks"
          :key="bookmark.recipe.id"
          :recipe="bookmark.recipe"
          bookmark
          :bookmark-id="bookmark.id"
        />
      </div>
      <div v-else class="flex flex-col min-h-[80vh] items-center justify-center my-auto space-y-4">
        <icon name="lucide:bookmark" size="64" class="opacity-50" />
        <p class="font-header-2 text-center">
          No Bookmarked Recipes found
        </p>
        <p class="font-paragraph-2 text-center opacity-70">
          Start by Bookmarking your first recipe!
        </p>
        <nuxt-link to="/recipes/" class="btn btn-primary rounded-full">
          <icon name="lucide:search" />
          Browse Recipes
        </nuxt-link>
      </div>
    </div>
    <div v-else class="flex flex-col min-h-[80vh] items-center justify-center my-auto">
      <span class="loading loading-dots loading-xl" />
      <p class="mt-4">
        Loading recipes...
      </p>
    </div>
  </div>
</template>
