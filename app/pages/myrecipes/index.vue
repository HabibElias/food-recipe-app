<script setup lang="ts">
import { ref } from "vue";

definePageMeta({
  middleware: ["auth"],
  requiresAuth: true,
});

const userStore = useUserStore();
const stats = ref([
  { label: "My Recipes", value: 20 },
  { label: "Total Likes", value: 100 },
  { label: "On Sale", value: 10 },
  { label: "Sold", value: 20 },
]);

const client = useApolloClient().client;

const GET_RECIPE_QUERY = gql`
query recipe($limit: Int!, $user_id: uuid) {
  recipe(limit: $limit, where: {user_id: {_eq: $user_id}}) {
    id
    title
    description
    category {
      id
      category_name
    }
    recipe_images(where: {is_thumbnail: {_eq: true}}) {
      id
      img_url
      is_thumbnail
    }
    prep_time
    recipe_ingredients_aggregate {
      aggregate {
        count
      }
    }
  }
}
`;

type Recipe = {
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

const recipes = ref<Recipe[]>([]);

try {
  console.log(userStore.user?.id);

  const { data } = await client.query<{ recipe: Recipe[] }>({
    query: GET_RECIPE_QUERY,
    variables: { limit: 6, user_id: userStore.user?.id },
  });

  recipes.value = data.recipe;
  console.log(data);
}
catch (err) {
  console.error(err);
}
</script>

<template>
  <div class="p-8 space-y-8 border border-base-content/50 rounded-4xl">
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
              {{ 20 }}
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
      <h2 class="font-header-3 mb-8">
        Your Recent Recipes
      </h2>

      <div class="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
        <app-recipe-card
          v-for="recipe in recipes"
          :key="recipe.id"
          :recipe="recipe"
        />
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
        <button class="btn btn-primary button-text py-10 btn-outline rounded-full">
          <icon name="lucide:link" size="30" />
          Manage All
        </button>
      </div>
    </div>
  </div>
</template>
