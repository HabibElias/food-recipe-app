<script setup lang="ts">
import DELETE_RECIPE_MUTATION from "~~/server/_mutations/DeleteRecipeMutation.gql";
import GET_MY_RECIPES_WITH_COUNT from "~~/server/_queries/GetMyRecipesWithCount.gql";
import { computed, onMounted, ref, watch } from "vue";

definePageMeta({
  middleware: ["auth"],
  requiresAuth: true,
});

const userStore = useUserStore();
const toast = useToast();

const itemsPerPage = ref(9);
const currentPage = ref(1);
const loading = ref(true);

const offset = computed(() => (currentPage.value - 1) * itemsPerPage.value);

const recipes = ref<Recipe[]>([]);
const totalCount = ref(0);
const totalPages = computed(() => Math.ceil(totalCount.value / itemsPerPage.value));

const deletingId = ref<number | null>(null);

async function loadRecipes() {
  loading.value = true;
  try {
    const client = useApolloClient().client;
    const { data } = await client.query<{ recipe: Recipe[]; recipe_aggregate: { aggregate: { count: number } } }>({
      query: GET_MY_RECIPES_WITH_COUNT,
      variables: {
        user_id: userStore.user?.id,
        limit: itemsPerPage.value,
        offset: offset.value,
      },
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
  <div class="p-8 space-y-8 border border-base-content/50 rounded-4xl">
    <div v-if="loading" class="flex flex-col min-h-[80vh] items-center justify-center my-auto">
      <span class="loading loading-dots loading-xl" />
      <p class="mt-4">
        Loading recipes...
      </p>
    </div>

    <div v-else-if="recipes && recipes.length > 0" class="space-y-6">
      <!-- Header -->
      <div class="flex items-center justify-between">
        <div>
          <h1 class="font-header-3">
            Manage Your Recipes
          </h1>
          <p class="font-paragraph-2 text-base-content/70 mt-1">
            Showing {{ recipes.length }} of {{ totalCount }} recipes
          </p>
        </div>
        <nuxt-link to="/recipes/add" class="btn btn-primary rounded-full">
          <icon name="lucide:plus" />
          Add New Recipe
        </nuxt-link>
      </div>

      <!-- Recipes Grid -->
      <div class="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
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
          class="btn btn-sm"
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
            class="btn btn-sm"
            :class="{ 'btn-primary': currentPage === page, 'btn-ghost': currentPage !== page }"
            :disabled="loading"
            @click="goToPage(page)"
          >
            {{ page }}
          </button>
        </div>

        <button
          class="btn btn-sm"
          :disabled="currentPage === totalPages || loading"
          @click="goToPage(currentPage + 1)"
        >
          Next
          <icon name="lucide:chevron-right" />
        </button>
      </div>
    </div>

    <div v-else class="flex flex-col min-h-[80vh] items-center justify-center my-auto space-y-4">
      <icon name="lucide:chef-hat" size="64" class="opacity-50" />
      <p class="font-header-2 text-center">
        No recipes found
      </p>
      <p class="font-paragraph-2 text-center opacity-70">
        Start by adding your first recipe!
      </p>
      <nuxt-link to="/recipes/add" class="btn btn-primary rounded-full">
        <icon name="lucide:plus" />
        Add Your First Recipe
      </nuxt-link>
    </div>
  </div>
</template>
