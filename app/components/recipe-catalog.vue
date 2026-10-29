<script setup lang="ts">
import Browse from "~~/server/_queries/BrowseRecipesQuery.gql";
import PublicBrowse from "~~/server/_queries/BrowseRecipesQueryNotLoggedIn.gql";
const props = defineProps<{ categoryName?: string }>();
const route = useRoute();
const user = useUserStore();
const client = useApolloClient().client;
const search = ref(String(route.query.search || ""));
const selectedCategory = ref(props.categoryName || String(route.query.category || ""));
const maxTime = ref(0);
const ingredients = ref("");
const creator = ref("");
const recipeType = ref("");
const categories = ref<{id:number; category_name:string}[]>([]);
const creators = ref<{id:string; username:string}[]>([]);
const recipes = ref<Recipe[]>([]);
const loading = ref(false);
const failed = ref(false);
const total = ref(0);
const page = ref(1);
const limit = 12;
let request = 0;
let timer: ReturnType<typeof setTimeout> | undefined;
const hasFilters = computed(() => search.value || selectedCategory.value || maxTime.value || ingredients.value || creator.value || recipeType.value);
function whereClause() {
 const values: any[] = [];
 if (search.value.trim()) values.push({title:{_ilike:"%" + search.value.trim() + "%"}});
 if (selectedCategory.value) values.push({category:{category_name:{_eq:selectedCategory.value}}});
 if (maxTime.value) values.push({prep_time:{_lte:Number(maxTime.value)}});
 if (ingredients.value.trim()) values.push({recipe_ingredients:{ingredient:{_ilike:"%" + ingredients.value.trim() + "%"}}});
 if (creator.value) values.push({user_id:{_eq:creator.value}});
 if (recipeType.value) values.push({is_paid:{_eq:recipeType.value === "paid"}});
 return values.length ? {_and:values} : {};
}
async function load() {
 const current = ++request;
 loading.value = true; failed.value = false;
 try {
  const { data } = await client.query({query:user.isLoggedIn ? Browse : PublicBrowse, variables:{limit,offset:(page.value-1)*limit,where:whereClause(),user_id:user.user?.id},fetchPolicy:"network-only"});
  if (current === request) { recipes.value=data.recipe || []; total.value=data.recipe_aggregate?.aggregate?.count || 0; }
 } catch { if (current === request) failed.value=true; }
 finally { if (current === request) loading.value=false; }
}
function reset() { search.value=""; selectedCategory.value=props.categoryName || ""; maxTime.value=0; ingredients.value=""; creator.value=""; recipeType.value=""; page.value=1; }
watch([search,selectedCategory,maxTime,ingredients,creator,recipeType],()=>{page.value=1;clearTimeout(timer);timer=setTimeout(load,250);});
watch(page,load);
onBeforeUnmount(()=>clearTimeout(timer));
try {
 const {data}=await client.query({query:gql("query CatalogOptions { category(order_by:{category_name:asc}){id category_name} user(order_by:{username:asc},where:{recipes:{}}){id username} }")});
 categories.value=data.category || [];creators.value=data.user || [];
} catch {
 try { const {data}=await client.query({query:gql("query CatalogCategories { category(order_by:{category_name:asc}){id category_name} }")}); categories.value=data.category || []; } catch { failed.value=true; }
}
await load();
useSeoMeta({ title:()=> (props.categoryName ? props.categoryName + " recipes" : "Find a recipe") + " — Bowlup" });
</script>
<template>
 <section style="padding-bottom:48px">
  <header class="page-heading"><h1>{{ categoryName ? categoryName + ", your way." : "Find your next favorite." }}</h1><p>A quick bite, a slow Sunday, or something in between. There's a recipe for that.</p></header>
  <div class="catalog-controls">
   <label class="search-field"><Icon name="lucide:search" size="19" /><input v-model="search" type="search" aria-label="Search recipes" placeholder="Search a dish or a craving"></label>
   <label class="field-group"><span class="sr-only">Category</span><select v-model="selectedCategory" class="select" aria-label="Category"><option value="">Every category</option><option v-for="item in categories" :key="item.id" :value="item.category_name">{{ item.category_name }}</option></select></label>
   <label class="field-group"><span class="sr-only">Cooking time</span><select v-model.number="maxTime" class="select" aria-label="Cooking time"><option :value="0">Any cooking time</option><option :value="15">15 min or less</option><option :value="30">30 min or less</option><option :value="45">45 min or less</option><option :value="60">One hour or less</option></select></label>
  </div>
  <details class="filter-details"><summary>More ways to find your meal</summary><div class="filter-fields">
   <label class="field-group"><span>With an ingredient</span><input v-model="ingredients" class="input" placeholder="Try lentils, tomato, or banana"></label>
   <label class="field-group"><span>From a cook</span><select v-model="creator" class="select"><option value="">Every kitchen</option><option v-for="person in creators" :key="person.id" :value="person.id">{{ person.username }}</option></select></label>
   <label class="field-group"><span>Recipe type</span><select v-model="recipeType" class="select"><option value="">Free and paid recipes</option><option value="free">Free recipes</option><option value="paid">Paid recipes</option></select></label>
  </div></details>
  <div class="catalog-summary flex items-center justify-between" aria-live="polite"><span>{{ loading ? "Looking through the kitchen…" : total + (total === 1 ? " recipe" : " recipes") }}</span><button v-if="hasFilters" type="button" class="text-link" @click="reset">Clear filters <Icon name="lucide:x" size="14" /></button></div>
  <div v-if="failed" class="empty-state" role="status"><h2>A little pause in the kitchen.</h2><p>We couldn't load your recipes. Give it another try.</p><button type="button" class="btn btn-outline" @click="load">Try again</button></div>
  <div v-else-if="loading && !recipes.length" class="skeleton-grid" aria-label="Loading recipes"><div v-for="item in 6" :key="item" class="recipe-skeleton" /></div>
  <TransitionGroup v-else-if="recipes.length" name="recipe-list" tag="div" class="recipe-grid" :aria-busy="loading"><AppRecipeCard v-for="(recipe,index) in recipes" :key="recipe.id" :recipe="recipe" :motion-index="index" /></TransitionGroup>
  <div v-else class="empty-state"><Icon name="lucide:search" size="28" /><h2>No matches this time.</h2><p>Try another ingredient or give yourself a little more cooking time.</p><button class="btn btn-outline" type="button" @click="reset">Start fresh</button></div>
  <nav v-if="total > limit" class="flex items-center justify-center gap-5 mt-10" aria-label="Recipe pages"><button class="btn btn-outline" :disabled="page === 1 || loading" @click="page--">Previous</button><span>{{ page }} / {{ Math.ceil(total/limit) }}</span><button class="btn btn-outline" :disabled="page * limit >= total || loading" @click="page++">Next</button></nav>
 </section>
</template>
