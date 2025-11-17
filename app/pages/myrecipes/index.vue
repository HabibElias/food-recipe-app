<script setup lang="ts">
import DELETE_RECIPE_MUTATION from "~~/server/_mutations/DeleteRecipeMutation.gql";
import GET_MY_RECIPES_WITH_COUNT from "~~/server/_queries/GetMyRecipesWithCount.gql";
import { computed, onMounted, ref, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
  layout: "custom",
  requiresAuth: true,
});

const userStore = useUserStore();
const toast = useToast();

const stats = ref([
  { label: "My Recipes", value: 20 },
  { label: "Total Likes", value: 100 },
  { label: "On Sale", value: 10 },
  { label: "Sold", value: 20 },
]);

const itemsPerPage = ref(6);
const currentPage = ref(1);
const loading = ref(true);

const offset = computed(() => (currentPage.value - 1) * itemsPerPage.value);

type RecipeData = {
  recipe: Recipe[];
  recipe_aggregate: {
    aggregate: {
      count: number;
    };
  };
};

const recipes = ref<Recipe[]>([]);
const totalCount = ref(0);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value));

const deletingId = ref<number | null>(null);

async function loadRecipes() {
  loading.value = true;
  try {
    const client = useApolloClient().client;
    const { data } = await client.query<RecipeData>({
      query: GET_MY_RECIPES_WITH_COUNT,
      variables: {
        user_id: userStore.user?.id,
        limit: itemsPerPage.value,
        offset: offset.value,
      },
    });

    recipes.value = data.recipe ?? [];
    totalCount.value = data.recipe_aggregate?.aggregate?.count ?? 0;
    // Update stats with actual count
    if (stats.value[0]) {
      stats.value[0].value = totalCount.value;
    }
  }
  catch (err: any) {
    console.error(err);
    toast.error({ title: "Error", message: err.message || "Failed to load recipes" });
  }
  finally {
    loading.value = false;
  }
}

async function handleDelete(id: number) {
  // eslint-disable-next-line no-alert
  if (!confirm("Are you sure you want to delete this recipe? This action cannot be undone.")) {
    return;
  }

  deletingId.value = id;
  try {
    const client = useApolloClient().client;
    await client.mutate({
      mutation: DELETE_RECIPE_MUTATION,
      variables: { id },
    });
    toast.success({ title: "Recipe Deleted", message: "Recipe has been successfully deleted" });
    await loadRecipes();
  }
  catch (err: any) {
    console.error(err);
    toast.error({ title: "Error", message: err.message || "Failed to delete recipe" });
  }
  finally {
    deletingId.value = null;
  }
}

function goToPage(page: number) {
  if (page >= 1 && page <= totalPages.value) {
    currentPage.value = page;
  }
}

watch([currentPage, itemsPerPage], () => {
  loadRecipes();
});

onMounted(() => {
  loadRecipes();
});
</script>

<template>
  <div v-if="recipes.length >= 0 && !loading" class="p-8 space-y-8 border border-base-content/50 rounded-4xl">
    <!-- USER GREETINGS -->
    <div>
      <div class="font-header-3">
        {{ (() => {
          const h = new Date().getHours();
          return h < 12 ? "Good morning" : "Good afternoon";
        })() }}, {{ userStore.user?.FirstName || "User" }}
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      <div class="indicator w-full">
        <div class="indicator-item indicator-bottom indicator-center w-fit">
          <nuxt-link to="/recipes/add" class="btn btn-primary rounded-full">
            <icon name="lucide:plus" />
            Add Recipe
          </nuxt-link>
        </div>
        <div class="card border-base-300 w-full border shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-paragraph-2">
              My Recipes
            </h2>
            <p class="font-header-2">
              {{ totalCount }}
            </p>
          </div>
        </div>
      </div>
      <div v-for="stat in stats.slice(1, 4)" :key="stat.label" class="card bg-base-100 shadow-md hover:shadow-lg transition">
        <div class="card border-base-300 w-full border shadow-sm">
          <div class="card-body">
            <h2 class="card-title font-paragraph-2">
              {{ stat.label }}
            </h2>
            <p class="font-header-2">
              {{ stat.value }}
            </p>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Recipes -->
    <div>
      <div class="flex items-center justify-between mb-8">
        <h2 class="font-header-3">
          Your Recipes
        </h2>
        <p v-if="totalCount > 0" class="font-paragraph-2 text-base-content/70">
          Showing {{ recipes.length }} of {{ totalCount }} recipes
        </p>
      </div>

      <div v-if="recipes.length > 0" class="space-y-6">
        <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          <app-manage-recipe-card
            v-for="recipe in recipes"
            :key="recipe.id"
            :recipe="recipe"
            :class="{ 'opacity-50 pointer-events-none': deletingId === recipe.id }"
            @delete="handleDelete"
          />
        </div>

        <!-- Pagination -->
        <div v-if="totalPages > 1" class="flex items-center justify-center gap-2 pt-4">
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

      <div v-else class="flex flex-col items-center justify-center py-12 space-y-4">
        <icon name="lucide:chef-hat" size="48" class="opacity-50" />
        <p class="font-paragraph-2 text-center opacity-70">
          No recipes yet. Start by adding your first recipe!
        </p>
      </div>
    </div>

    <!-- Actions -->
    <div>
      <h2 class="font-header-3 my-6">
        Actions
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 *:w-full">
        <nuxt-link to="/recipes/add" class="btn btn-primary button-text py-10 btn-outline rounded-full">
          <icon name="lucide:plus" size="30" />
          Add Recipes
        </nuxt-link>
        <nuxt-link to="/myrecipes/manage" class="btn btn-primary button-text py-10 btn-outline rounded-full">
          <icon name="lucide:link" size="30" />
          Manage All
        </nuxt-link>
      </div>
    </div>
  </div>

  <div v-else class="flex flex-col min-h-[80vh] items-center justify-center my-auto border border-base-content/50 rounded-4xl">
    <span class="loading loading-dots loading-xl" />
    <p class="mt-4">
      Loading recipes...
    </p>
  </div>
</template>
