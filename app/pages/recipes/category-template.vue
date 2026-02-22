<script setup lang="ts">
import BrowseRecipesQuery from "~~/server/_queries/BrowseRecipesQuery.gql";
import BrowseRecipesQueryNotLoggedIn from "~~/server/_queries/BrowseRecipesQueryNotLoggedIn.gql";
import { computed, onMounted, ref, watch } from "vue";

const props = defineProps<{ categoryName: string }>();

definePageMeta({ layout: "default", middleware: ["auth"], requiresAuth: true });

const toast = useToast();
const client = useApolloClient().client;

// Filters
const searchTitle = ref("");
const searchUser = ref("");
const ingredientSearch = ref("");
const prepTimeMin = ref<number | null>(null);
const prepTimeMax = ref<number | null>(null);
const itemsPerPage = ref(12);
const currentPage = ref(1);
const loading = ref(false);

const recipes = ref<any[]>([]);
const totalCount = ref(0);

const BrowseRecipes = computed(() => useUserStore().isLoggedIn ? BrowseRecipesQuery : BrowseRecipesQueryNotLoggedIn);

const offset = computed(() => (currentPage.value - 1) * itemsPerPage.value);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value));

// computed list of page numbers for template
const pages = computed(() => {
  const n = totalPages.value;
  if (!n || n <= 1) {
    return [];
  }

  return Array.from({ length: n }, (_, i) => i + 1);
});

function goToPage(page: number) {
  const p = Math.max(1, Math.min(page, totalPages.value || 1));
  if (p === currentPage.value) {
    return;
  }

  currentPage.value = p;
}

function buildWhereClause() {
  const conditions: any[] = [];

  // category filter (fixed)
  if (props.categoryName) {
    conditions.push({ category: { category_name: { _ilike: `%${props.categoryName}%` } } });
  }

  if (searchTitle.value && searchTitle.value.trim()) {
    conditions.push({ title: { _ilike: `%${searchTitle.value.trim()}%` } });
  }

  if (searchUser.value && searchUser.value.trim()) {
    conditions.push({ user: { username: { _ilike: `%${searchUser.value.trim()}%` } } });
  }

  if (ingredientSearch.value && ingredientSearch.value.trim()) {
    conditions.push({ recipe_ingredients: { ingredient: { _ilike: `%${ingredientSearch.value.trim()}%` } } });
  }

  if (prepTimeMin.value !== null) {
    conditions.push({ prep_time: { _gte: Number(prepTimeMin.value) } });
  }
  if (prepTimeMax.value !== null) {
    conditions.push({ prep_time: { _lte: Number(prepTimeMax.value) } });
  }

  if (conditions.length === 0)
    return {};
  if (conditions.length === 1)
    return conditions[0];
  return { _and: conditions };
}

async function loadRecipes() {
  loading.value = true;
  try {
    const where = buildWhereClause();
    const { data } = await client.query({
      query: BrowseRecipes.value,
      variables: { limit: itemsPerPage.value, offset: offset.value, where, user_id: useUserStore().user?.id },
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

watch([searchTitle, searchUser, ingredientSearch, prepTimeMin, prepTimeMax], () => {
  currentPage.value = 1;
  loadRecipes();
});

watch(itemsPerPage, () => {
  currentPage.value = 1;
  loadRecipes();
});

watch(currentPage, () => {
  loadRecipes();
});

onMounted(() => {
  loadRecipes();
});
</script>

<template>
  <div class="min-h-screen py-8 border border-base-content/50 rounded-4xl">
    <div class="px-4 md:px-10">
      <div class="flex flex-col md:flex-row md:items-center items-start gap-4 justify-between mb-6">
        <div>
          <h1 class="font-headline-1">
            {{ props.categoryName }} Recipes
          </h1>
          <p class="font-paragraph-2 text-base-content/70">
            Browse {{ props.categoryName }} recipes. Search by title, username or ingredient.
          </p>
        </div>
        <div>
          <nuxt-link to="/browse" class="btn btn-outline font-button-text rounded-full">
            Browse other categories
          </nuxt-link>
        </div>
      </div>

      <div class="card p-4 mb-6">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
          <input v-model="searchTitle" placeholder="Search by title" class="input input-bordered">
          <input v-model="searchUser" placeholder="Search by username" class="input input-bordered">
          <input v-model="ingredientSearch" placeholder="Search by ingredient" class="input input-bordered">
        </div>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mt-4">
          <input v-model.number="prepTimeMin" type="number" placeholder="Min prep time" class="input input-bordered">
          <input v-model.number="prepTimeMax" type="number" placeholder="Max prep time" class="input input-bordered">
          <div class="flex items-center gap-2">
            <select v-model.number="itemsPerPage" class="select select-bordered">
              <option :value="6">
                6
              </option>
              <option :value="12">
                12
              </option>
              <option :value="24">
                24
              </option>
            </select>
            <button class="btn btn-primary" @click="loadRecipes">
              Search
            </button>
          </div>
        </div>
      </div>

      <div v-if="loading" class="flex items-center justify-center py-8">
        <span class="loading loading-dots loading-xl" />
      </div>

      <div v-else>
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <app-recipe-card v-for="r in recipes" :key="r.id" :recipe="r" :bookmark="r.bookmark && r.bookmark.length > 0" :bookmark-id="r.bookmark?.[0]?.id" />
        </div>

        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 mt-6">
          <button class="btn btn-sm rounded-full" :disabled="currentPage === 1 || loading" @click="goToPage(currentPage - 1)">
            Prev
          </button>
          <div class="flex gap-1">
            <button v-for="p in pages" :key="p" class="btn btn-sm btn-circle" :class="{ 'btn-primary': currentPage === p }" :aria-current="currentPage === p ? 'page' : undefined" @click="goToPage(p)">
              {{ p }}
            </button>
          </div>
          <button class="btn btn-sm rounded-full" :disabled="currentPage === totalPages || loading" @click="goToPage(currentPage + 1)">
            Next
          </button>
        </div>
      </div>
    </div>
  </div>
</template>
