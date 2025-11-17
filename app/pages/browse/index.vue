<script setup lang="ts">
import type { Category } from "~~/shared/types/Category";

import BrowseRecipesQuery from "~~/server/_queries/BrowseRecipesQuery.gql";
import BrowseRecipesQueryNotLoggedIn from "~~/server/_queries/BrowseRecipesQueryNotLoggedIn.gql";
import GetRecipeCreatorsQuery from "~~/server/_queries/GetRecipeCreators.gql";
import { computed, onMounted, ref, watch } from "vue";

definePageMeta({
  layout: "default",
});

const toast = useToast();
const client = useApolloClient().client;

// Filter states
const searchTitle = ref("");
const selectedCategory = ref<number | null>(null);
const selectedCreator = ref<string | null>(null);
const prepTimeMin = ref<number | null>(null);
const prepTimeMax = ref<number | null>(null);
const ingredientSearch = ref("");
const itemsPerPage = ref(12);
const currentPage = ref(1);

// Data
const categories = ref<Category[]>([]);
const creators = ref<Array<{ id: string; username: string; FirstName: string; LastName: string; avatar_url: string }>>([]);
const recipes = ref<any[]>([]);
const totalCount = ref(0);
const loading = ref(false);

const offset = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value));

function hasBookmark(rec: any) {
  return !!(rec && rec.bookmarks && rec.bookmarks.length > 0);
}

function getBookmarkId(rec: any) {
  return rec && rec.bookmarks && rec.bookmarks[0] ? rec.bookmarks[0].id : undefined;
}

// Fetch categories
const GET_CATEGORIES = gql`
  query {
    category {
      id
      category_name
      category_description
    }
  }
`;

// Fetch creators - using imported query

// Build where clause for GraphQL query
function buildWhereClause() {
  const conditions: any[] = [];

  if (selectedCategory.value !== null) {
    conditions.push({ category_id: { _eq: selectedCategory.value } });
  }

  if (selectedCreator.value !== null) {
    conditions.push({ user_id: { _eq: selectedCreator.value } });
  }

  if (prepTimeMin.value !== null && Number(prepTimeMin.value) !== 0) {
    conditions.push({ prep_time: { _gte: Number(prepTimeMin.value) ?? null } });
  }

  if (prepTimeMax.value !== null && Number(prepTimeMax.value) !== 0) {
    conditions.push({ prep_time: { _lte: Number(prepTimeMax.value) ?? null } });
  }

  if (searchTitle.value && searchTitle.value.trim()) {
    conditions.push({ title: { _ilike: `%${searchTitle.value.trim()}%` } });
  }

  if (ingredientSearch.value && ingredientSearch.value.trim()) {
    conditions.push({
      recipe_ingredients: {
        ingredient: { _ilike: `%${ingredientSearch.value.trim()}%` },
      },
    });
  }

  if (conditions.length === 0) {
    return {};
  }
  if (conditions.length === 1) {
    return conditions[0];
  }
  return { _and: conditions };
}

// Load recipes
async function loadRecipes() {
  loading.value = true;
  try {
    const where = buildWhereClause();

    const { data } = await client.query({
      query: useUserStore().isLoggedIn ? BrowseRecipesQuery : BrowseRecipesQueryNotLoggedIn,
      variables: {
        limit: itemsPerPage.value,
        offset: offset.value,
        where,
        user_id: useUserStore().user?.id,
      },
      fetchPolicy: "network-only",
    });

    recipes.value = data.recipe ?? [];
    totalCount.value = data.recipe_aggregate?.aggregate?.count ?? 0;
  }
  catch (err: any) {
    console.error(err);
    toast.error({ title: "Error", message: err.message || "Failed to load recipes" });
  }
  finally {
    loading.value = false;
  }
}

// Load categories and creators
async function loadFilters() {
  try {
    const [categoriesData, creatorsData] = await Promise.all([
      client.query<{ category: Category[] }>({ query: GET_CATEGORIES }),
      client.query<{ recipe: Array<{ user: any }> }>({ query: GetRecipeCreatorsQuery }),
    ]);

    categories.value = categoriesData.data.category;
    // Extract unique creators
    const creatorMap = new Map();
    creatorsData.data.recipe.forEach((r) => {
      if (r.user && !creatorMap.has(r.user.id)) {
        creatorMap.set(r.user.id, r.user);
      }
    });
    creators.value = Array.from(creatorMap.values());
  }
  catch (err: any) {
    console.error(err);
    toast.error({ title: "Error", message: "Failed to load filters" });
  }
}

// Reset filters
function resetFilters() {
  searchTitle.value = "";
  selectedCategory.value = null;
  selectedCreator.value = null;
  prepTimeMin.value = null;
  prepTimeMax.value = null;
  ingredientSearch.value = "";
  currentPage.value = 1;
}

// Watch for filter changes and reload (excluding currentPage)
watch([searchTitle, selectedCategory, selectedCreator, prepTimeMin, prepTimeMax, ingredientSearch], () => {
  currentPage.value = 1;
  loadRecipes();
});

// Watch for page changes
watch(currentPage, () => {
  loadRecipes();
});

// Pagination
function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

onMounted(async () => {
  await loadFilters();
  await loadRecipes();
});
</script>

<template>
  <div class="min-h-screen py-4 md:py-8">
    <div class="w-full space-y-6">
      <!-- Header -->
      <div class="text-center space-y-2">
        <h1 class="font-headline-1 text-4xl md:text-5xl">
          Browse & Search Recipes
        </h1>
        <p class="font-paragraph-2 text-base-content/70">
          Discover delicious recipes by category, creator, ingredients, and more
        </p>
      </div>

      <!-- Filters Section -->
      <div class="card bg-base-content/10 max-w-7xl mx-auto border border-base-content/10">
        <div class="card-body">
          <div class="flex items-center justify-between mb-4">
            <h2 class="font-header-3 text-xl">
              Filters
            </h2>
            <button class="btn btn-sm btn-ghost" @click="resetFilters">
              <icon name="lucide:refresh-cw" />
              Reset Filters
            </button>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <!-- Search by Title -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Search by Title</span>
              </label>
              <input
                v-model="searchTitle"
                type="text"
                placeholder="Enter recipe title..."
                class="input input-bordered w-full"
              >
            </div>

            <!-- Category Filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Category</span>
              </label>
              <select
                v-model="selectedCategory"
                class="select select-bordered w-full"
              >
                <option :value="null">
                  All Categories
                </option>
                <option
                  v-for="category in categories"
                  :key="category.id"
                  :value="category.id"
                >
                  {{ category.category_name }}
                </option>
              </select>
            </div>

            <!-- Creator Filter -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Creator</span>
              </label>
              <select
                v-model="selectedCreator"
                class="select select-bordered w-full"
              >
                <option :value="null">
                  All Creators
                </option>
                <option
                  v-for="creator in creators"
                  :key="creator.id"
                  :value="creator.id"
                >
                  {{ creator.FirstName }} {{ creator.LastName }} (@{{ creator.username }})
                </option>
              </select>
            </div>

            <!-- Prep Time Min -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Min Prep Time (minutes)</span>
              </label>
              <input
                v-model.number="prepTimeMin"
                type="number"
                min="0"
                placeholder="e.g. 10"
                class="input input-bordered w-full"
              >
            </div>

            <!-- Prep Time Max -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Max Prep Time (minutes)</span>
              </label>
              <input
                v-model.number="prepTimeMax"
                type="number"
                min="1"
                placeholder="e.g. 60"
                class="input input-bordered w-full"
              >
            </div>

            <!-- Ingredient Search -->
            <div class="form-control">
              <label class="label">
                <span class="label-text">Search by Ingredient</span>
              </label>
              <input
                v-model="ingredientSearch"
                type="text"
                placeholder="Enter ingredient name..."
                class="input input-bordered w-full"
              >
            </div>
          </div>
        </div>
      </div>

      <!-- Results Section -->
      <div class="space-y-4">
        <!-- Results Header -->
        <div class="flex items-center justify-between">
          <div>
            <h2 class="font-header-3 text-2xl">
              Results
            </h2>
            <p class="font-paragraph-2 text-base-content/70 mt-1">
              Showing {{ recipes.length }} of {{ totalCount }} recipes
            </p>
          </div>
        </div>

        <!-- Loading State -->
        <div v-if="loading" class="flex flex-col items-center justify-center py-12">
          <span class="loading loading-dots loading-xl" />
          <p class="mt-4 font-paragraph-2">
            Loading recipes...
          </p>
        </div>

        <!-- Recipes Grid -->
        <div v-else-if="recipes && recipes.length > 0" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-recipe-card
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :bookmark="hasBookmark(recipe)"
            :bookmark-id="getBookmarkId(recipe)"
          />
        </div>

        <!-- No Results -->
        <div v-else class="flex flex-col items-center justify-center py-12 space-y-4">
          <icon name="lucide:search-x" size="64" class="opacity-50" />
          <p class="font-header-2 text-center">
            No recipes found
          </p>
          <p class="font-paragraph-2 text-center opacity-70">
            Try adjusting your filters or search terms
          </p>
          <button class="btn btn-primary rounded-full" @click="resetFilters">
            <icon name="lucide:refresh-cw" />
            Reset Filters
          </button>
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1 && !loading" class="flex items-center justify-center gap-2 pt-4">
          <button
            class="btn btn-sm rounded-full"
            :disabled="currentPage === 1 || loading"
            @click="goToPage(currentPage - 1)"
          >
            <icon name="lucide:chevron-left" />
            Previous
          </button>

          <div class="flex gap-1">
            <button
              v-for="page in totalPages"
              :key="page"
              class="btn btn-sm btn-circle"
              :class="{ 'btn-primary': currentPage === page, 'btn-ghost': currentPage !== page }"
              :disabled="loading"
              @click="goToPage(page)"
            >
              {{ page }}
            </button>
          </div>

          <button
            class="btn btn-sm rounded-full"
            :disabled="currentPage === totalPages || loading"
            @click="goToPage(currentPage + 1)"
          >
            Next
            <icon name="lucide:chevron-right" />
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
