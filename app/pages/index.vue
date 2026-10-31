<script setup lang="ts">
import type { LandingRecipe } from "~~/shared/types/LandingRecipe";
import starterRecipes from "~/data/landing-recipes.json";

const user = useUserStore();
const landing = ref<HTMLElement | null>(null);
useLandingMotion(landing);

const recipes = starterRecipes as LandingRecipe[];
const heroRecipes = recipes.filter(recipe => recipe.key !== "v1/shiro-wot");
const heroRecipeIndex = ref(0);
const heroRecipe = computed(() => heroRecipes[heroRecipeIndex.value]!);
function nextHeroRecipe() {
  heroRecipeIndex.value = (heroRecipeIndex.value + 1) % heroRecipes.length;
}
const search = ref("");
const maxTime = ref(0);
const recipeIds = ref<Record<string, number>>({});
const faqs = [
  { question: "Can I have a look before joining?", answer: "Yes. Browse the starter recipes and read free ingredients and cooking steps without an account. Join when you'd like to save favorites, rate a dish, or share a recipe." },
  { question: "What if I only have half an hour?", answer: "Choose a cooking time when you search. In the recipe browser, you can also narrow things down by category or an ingredient you have on hand." },
  { question: "Can I share my own recipes?", answer: "Absolutely. Give your recipe a name, list the ingredients and amounts, then write the cooking steps. You can return to edit the details from Your recipes." },
  { question: "Can I use Bowlup on my phone?", answer: "Yes. Bowlup works in your browser on phones, tablets, and computers. Open a recipe in the kitchen and tick off ingredients as you go." },
];

function recipeLink(recipe: LandingRecipe) {
  const id = recipeIds.value[recipe.title];
  return id ? `/recipes/${id}` : { path: "/browse", query: { search: recipe.title } };
}
function findRecipe() {
  const query: Record<string,string> = {};
  if (search.value.trim()) query.search = search.value.trim();
  if (maxTime.value) query.maxTime = String(maxTime.value);
  return navigateTo({ path: "/browse", query });
}

// The introduction and real recipe preview render immediately, even on a cold API.
// Live IDs enhance the existing catalog links after hydration.
onMounted(async () => {
  try {
    const { data } = await useApolloClient().client.query({
      query: gql("query LandingRecipeLinks($titles:[String!]!){recipe(where:{title:{_in:$titles}}){id title}}"),
      variables: { titles: recipes.map(recipe => recipe.title) },
      context: { fetchOptions: { signal: AbortSignal.timeout(6000) } },
    });
    recipeIds.value = Object.fromEntries(data.recipe.map((recipe: {id:number;title:string}) => [recipe.title,recipe.id]));
  } catch { /* The title-based catalog links remain usable. */ }
});

useSeoMeta({
  title: "Bowlup — Cook something good tonight",
  description: "Find something worth cooking, save your favorites, and follow clear steps from the first chop to the last bite. Meet Bowlup, your everyday recipe companion.",
});
</script>

<template>
  <div ref="landing" class="landing-page">
    <section class="photo-opening" aria-labelledby="landing-title">
      <div class="hero-backdrop" aria-hidden="true">
        <Transition name="hero-background"><img :key="heroRecipe.image" :src="heroRecipe.image" alt="" width="1600" height="1067" fetchpriority="high"></Transition>
      </div>
      <div class="site-frame photo-hero-inner">
        <div class="photo-hero-copy">
          <h1 id="landing-title">Cook something<br>good tonight.</h1>
          <p>Your everyday recipe companion. Find a meal you love, save it for later, and make it your own.</p>
          <a href="#how-it-works" class="photo-hero-how">See how Bowlup works<Icon name="lucide:arrow-down" size="18" /></a>
        </div>
        <div class="photo-hero-pick">
          <NuxtLink :to="recipeLink(heroRecipe)" aria-live="polite" aria-atomic="true"><strong>{{ heroRecipe.title }}</strong><span>{{ heroRecipe.minutes }} minutes · View recipe<Icon name="lucide:arrow-up-right" size="18" /></span></NuxtLink>
          <button type="button" class="photo-hero-next" @click="nextHeroRecipe" aria-label="Another recipe idea"><Icon name="lucide:shuffle" size="21" /></button>
        </div>
        <form class="hero-finder" role="search" aria-label="Find your first Bowlup recipe" @submit.prevent="findRecipe">
          <div class="hero-finder-query"><label for="landing-search">What sounds good?</label><div class="landing-search-field"><Icon name="lucide:search" size="19" /><input id="landing-search" v-model="search" type="search" placeholder="Pasta, pancakes, roast chicken…"></div></div>
          <div class="hero-finder-time"><label for="landing-time">Time in the kitchen</label><select id="landing-time" v-model.number="maxTime" class="select"><option :value="0">Any time</option><option :value="15">Up to 15 min</option><option :value="30">Up to 30 min</option><option :value="60">Up to 1 hour</option></select></div>
          <button type="submit" class="btn opening-search-button">Find a recipe<Icon name="lucide:arrow-right" size="18" /></button>
        </form>
      </div>
    </section>

    <LandingRecipeJourney :key="heroRecipe.key" :recipe="heroRecipe" :recipe-link="recipeLink(heroRecipe)" />

    <section id="your-kitchen" class="landing-kitchen site-frame" aria-labelledby="kitchen-benefits-title">
      <div class="landing-kitchen-photo" data-reveal="photo"><img src="/images/recipes/avocado-toast.webp" alt="Avocado toast topped with colorful tomatoes" width="700" height="760" loading="lazy"><p>Avocado and Tomato Toast<span>A little good in 10 minutes.</span></p></div>
      <div class="landing-kitchen-copy"><h2 id="kitchen-benefits-title" data-reveal="print">A kitchen that<br>fits your life.</h2>
        <div class="kitchen-benefit"><h3>Start with what you have.</h3><p>A few tomatoes? A little time? Search by dish, cooking time, or ingredient instead of starting from scratch.</p></div>
        <div class="kitchen-benefit"><h3>Keep your go-to meals close.</h3><p>Your saved recipes become a personal recipe book. The quick lunch and the weekend favorite both have a place.</p></div>
        <div class="kitchen-benefit"><h3>Leave a little kitchen wisdom.</h3><p>A helpful swap, a cooking tip, or a rating after dinner. Share what worked with the next person who makes it.</p></div>
        <NuxtLink :to="user.isLoggedIn ? '/bookmarks' : '/auth/sign-up'" class="text-link">{{ user.isLoggedIn ? 'Open your recipe book' : 'Make a little space for your favorites' }}<Icon name="lucide:arrow-up-right" size="18" /></NuxtLink>
      </div>
    </section>

    <section class="landing-share" aria-labelledby="share-title"><div class="site-frame share-layout">
      <div><h2 id="share-title" data-reveal="print">Pass a little<br>of your kitchen on.</h2><p>The weekday fix. The family favorite. The dish you finally got right. Give it a name, write down what goes in, and show another cook how it comes together.</p><NuxtLink :to="user.isLoggedIn ? '/recipes/add' : '/auth/sign-up'" class="btn btn-outline">Share your first recipe<Icon name="lucide:arrow-up-right" size="17" /></NuxtLink></div>
      <div class="share-recipe-note" data-reveal="pass"><img src="/images/recipes/tomato-pasta.webp" alt="Tomato and basil pasta served on a white plate" width="500" height="360" loading="lazy"><p>Some recipes feel like home.</p><span>Make room for yours.</span></div>
    </div></section>

    <section id="recipes" class="landing-starters site-frame" aria-labelledby="starters-title">
      <header class="landing-section-heading"><div><h2 id="starters-title">A good place to start.</h2><p>Real dishes from the Bowlup starter kitchen. Find the one that sounds like tonight.</p></div><NuxtLink to="/browse" class="text-link">Explore all recipes<Icon name="lucide:arrow-up-right" size="18" /></NuxtLink></header>
      <div class="starter-recipe-grid"><article v-for="(recipe,index) in recipes" :key="recipe.key" class="starter-recipe" data-reveal="recipe" :data-reveal-delay="index * 70"><NuxtLink :to="recipeLink(recipe)" :aria-label="'Cook '+recipe.title"><img :src="recipe.image" :alt="recipe.title" width="600" height="470" loading="lazy"><div><h3>{{ recipe.title }}</h3><span class="starter-recipe-facts">{{ recipe.category }} · {{ recipe.minutes }} min</span><p>{{ recipe.description }}</p><span class="text-link">Let's cook<Icon name="lucide:arrow-up-right" size="17" /></span></div></NuxtLink></article></div>
    </section>

    <section id="good-to-know" class="landing-faq" aria-labelledby="faq-title"><div class="site-frame"><h2 id="faq-title" data-reveal="print">A few things to know.</h2><div class="landing-answers"><p v-for="faq in faqs" :key="faq.question"><strong>{{ faq.question }}</strong>{{ faq.answer }}</p></div></div></section>

    <section class="landing-closing" aria-labelledby="closing-title"><div class="site-frame closing-layout"><div><h2 id="closing-title">Something good<br>starts here.</h2><p>Find a recipe for tonight. Keep it for next time.</p><NuxtLink :to="user.isLoggedIn ? '/bookmarks' : '/auth/sign-up'" class="text-link">{{ user.isLoggedIn ? 'Your recipe book' : 'Create your free account' }}<Icon name="lucide:arrow-up-right" size="18" /></NuxtLink></div><form class="closing-search" role="search" aria-label="Find your next Bowlup recipe" @submit.prevent="findRecipe"><label for="closing-search">What would you like to make?</label><div class="landing-search-field"><Icon name="lucide:search" size="19" /><input id="closing-search" v-model="search" type="search" placeholder="Find your next favorite"></div><button class="btn opening-search-button" type="submit">Find a recipe<Icon name="lucide:arrow-right" size="18" /></button></form></div></section>
  </div>
</template>
