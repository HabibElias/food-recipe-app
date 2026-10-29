<script setup lang="ts">
const props = defineProps<{ recipe: Recipe; bookmark?: boolean; bookmarkId?: number }>();
const store = useBookmarksStore();
const user = useUserStore();
const busy = ref(false);
const saved = computed(() => props.bookmark || store.bookmarks.some((entry: any) => entry.recipe?.id === props.recipe.id));
const cover = computed(() => props.recipe.recipe_images?.find(image => image.is_thumbnail)?.img_url || props.recipe.recipe_images?.[0]?.img_url);
async function toggleSaved() {
 if (!user.isLoggedIn) { await navigateTo("/auth/login"); return; }
 busy.value = true;
 try {
  if (saved.value) { const id = props.bookmarkId || store.bookmarks.find((entry: any) => entry.recipe?.id === props.recipe.id)?.id; if (id) await store.removeBookmark(id); }
  else await store.addBookmark(props.recipe.id);
 } catch { useToast().error({ message: "We couldn't update your saved recipes. Please try again." }); }
 finally { busy.value = false; }
}
</script>
<template>
 <article class="recipe-card">
  <NuxtLink :to="'/recipes/' + recipe.id" class="recipe-photo-wrap" :aria-label="'View ' + recipe.title"><img v-if="cover" class="recipe-photo" :src="cover" :alt="recipe.title" loading="lazy" width="600" height="440"><img v-else class="recipe-photo" src="/brand/bowlup-icon-orange.svg" alt="Recipe photo coming soon" loading="lazy"></NuxtLink>
  <button type="button" class="save-button" :aria-pressed="saved" :aria-label="saved ? 'Unsave ' + recipe.title : 'Save ' + recipe.title" :disabled="busy" @click="toggleSaved"><Icon :name="busy ? 'lucide:loader-circle' : 'lucide:bookmark'" size="19" :class="{ 'animate-spin': busy }" :style="saved ? { fill: 'currentColor' } : undefined" /></button>
  <div class="recipe-card-info"><div class="recipe-card-meta"><span>{{ recipe.category?.category_name || "Recipe" }}</span><span class="meta-dot" /><span>{{ recipe.prep_time }} min</span></div><h3><NuxtLink :to="'/recipes/' + recipe.id">{{ recipe.title }}</NuxtLink></h3><p class="recipe-card-note"><span v-if="recipe.is_paid" class="price-note">{{ Number(recipe.price).toFixed(2) }} ETB · </span>By {{ recipe.user?.FirstName || recipe.user?.username || "the kitchen" }} {{ recipe.user?.LastName || "" }}</p></div>
 </article>
</template>
