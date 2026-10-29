<script setup lang="ts">
import useRecipe from "~/composables/useRecipe";
definePageMeta({key:route=>route.fullPath});
const route=useRoute();const user=useUserStore();const bookmarks=useBookmarksStore();
const {recipe,loading,loadRecipe,likesCount,userHasLiked,toggleLike,liking,selectedRating,onRatingChange,submitRating,ratingMessage,newComment,addComment,posting,buyRecipe,checkingOut}=useRecipe(String(route.params.id));
const saved=computed(()=>bookmarks.bookmarks.some((x:any)=>x.recipe?.id===recipe.value?.id));
const cover=computed(()=>recipe.value?.recipe_images?.find(x=>x.is_thumbnail)?.img_url || recipe.value?.recipe_images?.[0]?.img_url);
const canRead=computed(()=>!recipe.value?.is_paid || recipe.value?.user_id===user.user?.id || !!recipe.value?.payments?.length);
const canPay=ref(false);const saveBusy=ref(false);const copied=ref(false);
await loadRecipe();
onMounted(async()=>{
 if(user.isLoggedIn) {
  await bookmarks.loadBookmarks();
  try {const {data}=await useApolloClient().client.query({query:gql("{__schema{mutationType{fields{name}}}}")});canPay.value=data.__schema.mutationType.fields.some((x:any)=>x.name==="initializePayment");}catch{}
 }
});
async function toggleSave(){
 if(!user.isLoggedIn){navigateTo("/auth/login");return;}
 if(!recipe.value)return;saveBusy.value=true;
 try {const existing=bookmarks.bookmarks.find((x:any)=>x.recipe?.id===recipe.value?.id);if(existing)await bookmarks.removeBookmark(existing.id);else await bookmarks.addBookmark(recipe.value.id);}
 finally{saveBusy.value=false;}
}
async function share(){try{await navigator.clipboard.writeText(window.location.href);copied.value=true;setTimeout(()=>copied.value=false,2000);}catch{useToast().info({message:"Copy this page's address to share the recipe."});}}
useSeoMeta({title:()=> (recipe.value?.title || "Recipe") + " — Bowlup",description:()=>recipe.value?.description});
</script>
<template>
 <article v-if="recipe">
  <NuxtLink to="/browse" class="text-link mt-6 text-sm"><Icon name="lucide:arrow-left" size="16" /> Back to recipes</NuxtLink>
  <div class="detail-grid">
   <img v-if="cover" class="detail-photo" :src="cover" :alt="recipe.title" width="700" height="700" fetchpriority="high">
   <div v-else class="detail-photo bg-base-200 flex items-center justify-center"><span>There's a good meal behind this recipe.</span></div>
   <div class="detail-heading">
    <h1>{{ recipe.title }}</h1><p>{{ recipe.description }}</p>
    <p class="font-small-text mt-5">From the kitchen of <strong>{{ recipe.user?.FirstName }} {{ recipe.user?.LastName }}</strong></p>
    <div class="recipe-facts"><NuxtLink :to="{path:'/browse',query:{category:recipe.category?.category_name}}" class="text-link text-sm">{{ recipe.category?.category_name }} <Icon name="lucide:arrow-up-right" size="14" /></NuxtLink><div><Icon name="lucide:clock-3" size="19" />{{ recipe.prep_time }} min</div><div v-if="canRead"><Icon name="lucide:carrot" size="19" />{{ recipe.recipe_ingredients?.length }} ingredients</div><div><Icon name="lucide:heart" size="19" />{{ likesCount }} {{ likesCount===1 ? 'cook likes' : 'cooks like' }} this</div></div>
    <div class="detail-actions"><a v-if="canRead" href="#cook" class="btn btn-primary">Let's cook <Icon name="lucide:arrow-down" size="17" /></a><button type="button" class="btn btn-outline" :disabled="saveBusy" :aria-pressed="saved" @click="toggleSave"><Icon name="lucide:bookmark" size="17" />{{ saved ? "Saved" : "Save recipe" }}</button><button type="button" class="icon-button" :aria-label="copied ? 'Link copied' : 'Copy recipe link'" @click="share"><Icon :name="copied ? 'lucide:check' : 'lucide:share-2'" size="19" /></button></div>
    <NuxtLink v-if="recipe.user_id===user.user?.id" :to="'/myrecipes/edit/'+recipe.id" class="text-link mt-5 text-sm">Edit your recipe <Icon name="lucide:pencil" size="15" /></NuxtLink>
   </div>
  </div>
  <section v-if="!canRead" class="bowlup-panel mt-10"><h2 class="font-header-3">A recipe from this cook's collection.</h2><p class="mt-3">Unlock the ingredients and cooking steps for {{ Number(recipe.price).toFixed(2) }} ETB.</p><button v-if="canPay" class="btn btn-primary" :disabled="checkingOut" @click="buyRecipe">{{ checkingOut ? 'Opening checkout…' : 'Buy this recipe' }}</button><NuxtLink v-else-if="!user.isLoggedIn" to="/auth/login" class="btn btn-primary">Sign in to continue</NuxtLink><p v-else class="font-paragraph-2">Checkout isn't available yet. You can save this recipe and come back later.</p></section>
  <div v-else id="cook" class="cooking-body">
   <section class="ingredients-panel"><h2>What you'll need.</h2><ul class="ingredient-list"><li v-for="item in recipe.recipe_ingredients" :key="item.id"><label><input type="checkbox"><span>{{ item.ingredient }}</span></label></li></ul></section>
   <section class="steps-panel"><h2>Let's make it.</h2><ol class="step-list"><li v-for="step in recipe.recipe_steps" :key="step.id"><span class="step-number" aria-hidden="true">{{ step.step_no }}.</span><p>{{ step.step_description }}</p></li></ol></section>
  </div>
  <section class="community-section"><h2>A little from the kitchen.</h2><div class="flex flex-wrap items-center gap-4 mb-7"><button class="btn btn-outline" :disabled="liking" :aria-pressed="userHasLiked" @click="toggleLike"><Icon name="lucide:heart" size="17" :style="userHasLiked ? {fill:'currentColor'} : undefined" />{{ userHasLiked ? 'Liked' : 'Like this recipe' }}</button><span class="text-sm text-base-content/70">{{ recipe.recipe_ratings?.length ? recipe.recipe_ratings.length+' ratings from the kitchen' : "Be the first to leave a rating." }}</span></div>
   <div class="flex flex-wrap items-center gap-4 mb-4"><AppStarRating v-model="selectedRating" :max-stars="5" @rating-data="onRatingChange" /><button class="btn btn-outline" :disabled="!selectedRating" @click="submitRating">Leave a rating</button><span role="status" class="text-sm">{{ ratingMessage }}</span></div>
   <form class="mt-8 mb-5" @submit.prevent="addComment"><label for="recipe-comment" class="block font-semibold mb-3">How did it go?</label><textarea id="recipe-comment" v-model="newComment" class="textarea" rows="3" placeholder="A tip, a twist, or a little encouragement…" required :disabled="posting" /><button class="btn btn-outline mt-3" type="submit" :disabled="posting || !newComment.trim()">{{ posting ? 'Sharing…' : 'Share a note' }}</button></form>
   <div v-if="!recipe.recipe_comments?.length" class="text-sm text-base-content/70">No notes yet. Your kitchen might have the first one.</div>
   <article v-for="comment in recipe.recipe_comments" :key="comment.id" class="comment"><strong>{{ comment.user?.FirstName || comment.user?.username || "A fellow cook" }}</strong><p>{{ comment.comment_body }}</p></article>
  </section>
 </article>
 <div v-else class="empty-state my-10"><h1 class="font-header-2">{{ loading ? "Getting the recipe ready…" : "This recipe isn't on the menu." }}</h1><p v-if="!loading">It may have moved, or the kitchen is taking a short break.</p><NuxtLink v-if="!loading" to="/browse" class="btn btn-primary">Find another recipe</NuxtLink></div>
</template>
