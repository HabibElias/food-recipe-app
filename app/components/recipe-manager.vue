<script setup lang="ts">
import GET from "~~/server/_queries/GetMyRecipesWithCount.gql";
import DELETE from "~~/server/_mutations/DeleteRecipeMutation.gql";
const user = useUserStore();
const client = useApolloClient().client;
const recipes = ref<any[]>([]);
const stats = reactive({ total: 0, likes: 0, paid: 0, sold: 0 });
const loading = ref(true);
const error = ref("");
const page = ref(1);
const deleting = ref<number | null>(null);
const pages = computed(() => Math.max(1, Math.ceil(stats.total / 9)));
async function load() {
  loading.value = true; error.value = "";
  try {
    const { data } = await client.query({ query: GET, variables: { user_id: user.user?.id, limit: 9, offset: (page.value - 1) * 9 }, fetchPolicy: "network-only" });
    recipes.value = data.recipe;
    Object.assign(stats, { total: data.recipe_count.aggregate.count, likes: data.like_count.aggregate.count, paid: data.on_sale_count.aggregate.count, sold: data.sold_count.aggregate.count });
  } catch { error.value = "We couldn't load your recipes. Please try again."; }
  finally { loading.value = false; }
}
async function remove(id: number) {
  if (!confirm("Delete this recipe and its ingredients, steps and photos? This cannot be undone.")) return;
  deleting.value = id;
  try {
    const { data } = await client.mutate({ mutation: DELETE, variables: { id } });
    if (!data.delete_recipe.returning.length) throw new Error("Not deleted");
    if (recipes.value.length === 1 && page.value > 1) page.value--;
    else await load();
  } catch { error.value = "We couldn't delete the recipe. Please try again."; }
  finally { deleting.value = null; }
}
watch(page, load);
await load();
</script>
<template>
 <section class="pb-12">
  <header class="page-heading section-heading"><div><h1>Your little recipe book.</h1><p>The recipes you've shared from your kitchen.</p></div><NuxtLink to="/recipes/add" class="btn btn-primary"><Icon name="lucide:plus" size="18" />Create a recipe</NuxtLink></header>
  <div v-if="!loading && !error" class="manager-stats" aria-label="Your recipe activity"><div><strong>{{ stats.total }}</strong><span>Recipes shared</span></div><div><strong>{{ stats.likes }}</strong><span>Likes received</span></div><div><strong>{{ stats.paid }}</strong><span>Paid recipes</span></div><div><strong>{{ stats.sold }}</strong><span>Purchases</span></div></div>
  <div v-if="error" class="form-error mb-6" role="alert">{{ error }} <button class="text-link" @click="load">Try again</button></div>
  <div v-if="loading" class="empty-state" role="status"><span class="loading loading-spinner" /><p>Opening your recipe book…</p></div>
  <div v-else-if="recipes.length" class="recipe-grid"><div v-for="recipe in recipes" :key="recipe.id"><AppRecipeCard :recipe="recipe" /><div class="recipe-manager-actions"><NuxtLink :to="'/myrecipes/edit/'+recipe.id" class="text-link"><Icon name="lucide:pencil" size="16" />Edit recipe</NuxtLink><button class="text-link text-sm" :disabled="deleting===recipe.id" @click="remove(recipe.id)">{{ deleting===recipe.id ? 'Deleting…' : 'Delete' }}</button></div></div></div>
  <div v-else-if="!error" class="empty-state"><Icon name="lucide:notebook-pen" size="32" /><h2>Good things start with one recipe.</h2><p>Put your favorite dish into words. Someone else's dinner might start here.</p><NuxtLink to="/recipes/add" class="btn btn-primary mt-5">Share your first recipe</NuxtLink></div>
  <nav v-if="pages>1" class="flex justify-center items-center gap-5 mt-10" aria-label="Recipe pages"><button class="btn btn-outline" :disabled="page===1 || loading" @click="page--">Previous</button><span>{{ page }} of {{ pages }}</span><button class="btn btn-outline" :disabled="page===pages || loading" @click="page++">Next</button></nav>
 </section>
</template>
