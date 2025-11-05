<script lang="ts" setup>
import { ref } from "vue";

const categories: { name: string; icon: string }[] = [
  { name: "Breakfast", icon: "/img/breakfast.svg" },
  { name: "Lunch", icon: "/img/lunch.svg" },
  { name: "Dinner", icon: "/img/dinner.svg" },
  { name: "Dessert", icon: "/img/dessert.svg" },
  { name: "Quick bite", icon: "/img/quickbite.svg" },
];

const slides = ["slide1", "slide2"];

function left() {
  const current = window.location.hash.replace("#", "") || "slide1";
  const idx = slides.indexOf(current);
  const prev = slides[(idx - 1 + slides.length) % slides.length];
  window.location.hash = `#${prev}`;
}
function right() {
  const current = window.location.hash.replace("#", "") || "slide1";
  const idx = slides.indexOf(current);
  const prev = slides[(idx + 1 + slides.length) % slides.length];
  window.location.hash = `#${prev}`;
}

type Recipe = {
  title: string;
  imgUrl: string;
  prepTime: string;
  ingredientsCount: number;
  description: string;
};

const recipes = ref<Recipe[]>([
  {
    title: "Classic Cheeseburger",
    imgUrl:
      "https://cdn.britannica.com/98/235798-050-3C3BA15D/Hamburger-and-french-fries-paper-box.jpg",
    prepTime: "20 MIN",
    ingredientsCount: 7,
    description:
      "Juicy grilled beef patty with melted cheddar, crisp lettuce, tomato, and a tangy house sauce on a toasted bun.",
  },
  {
    title: "Avocado Toast with Poached Egg",
    imgUrl:
    "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b2a1f3b0b2e0a9f6c2b6c2c6d0b1f9b",
    prepTime: "10 MIN",
    ingredientsCount: 6,
    description:
      "Crushed ripe avocado seasoned with lemon and chili flakes, topped with a silky poached egg on sourdough.",
  },
  {
    title: "Spaghetti Bolognese",
    imgUrl:
      "https://images.unsplash.com/photo-1551183053-bf91a1d81141?w=1200&q=80&auto=format&fit=crop&ixlib=rb-4.0.3&s=5b2a1f3b0b2e0a9f6c2b6c2c6d0b1f9b",
    prepTime: "45 MIN",
    ingredientsCount: 12,
    description:
      "Rich slow-simmered tomato and beef ragù served over al dente spaghetti, finished with grated Parmesan.",
  },
]);
</script>

<template>
  <div>
    <!-- Hero -->
    <div
      class="hero min-h-[80vh] rounded-4xl"
      style="background-image: url('/img/hero2.jpeg')"
    >
      <div class="hero-overlay rounded-4xl z-0" />
      <div class="hero-content text-neutral-content text-center z-10">
        <div class="max-w-fit">
          <h1 class="mb-5 font-headline-1">
            UNLEASH CULINARY EXCELLENCE
          </h1>
          <p class="mb-5 font-paragraph-1 font-light">
            Explore a world of flavors, discover handcrafted recipes, and let the aroma of our passion for cooking fill your kitchen
          </p>
          <button class="btn btn-primary rounded-full font-button-text">
            Get Started
          </button>
        </div>
      </div>
    </div>

    <!-- categories -->
    <div class="mb-4 rounded-4xl flex flex-col md:flex-row items-center justify-center md:justify-around py-10 px-6 flex-wrap text-success-content min-h-[60vh] bg-success mt-5">
      <div class="w-full md:w-md lg:self-end mb-16">
        <div class="badge badge-primary font-button-text mb-4">
          EXPLORE
        </div>
        <div class="font-header-2 mb-3">
          OUR DIVERSE PALETTE
        </div>
        <p class="font-paragraph-2 mb-10">
          If you are a breakfast enthusiast, a connoisseur of savory delights, or on the lookout for irresistible desserts, our curated selection has something to satisfy every palate.
        </p>
        <button class="btn btn-outline font-button-text rounded-full">
          SEE MORE
        </button>
      </div>
      <div class="w-full md:w-md">
        <div
          v-for="category in categories"
          :key="category.name"
        >
          <div class="flex items-center font-subtitle py-4 justify-between">
            <img :src="category.icon" :alt="category.name">
            <div>{{ category.name.toUpperCase() }}</div>
          </div>
          <div class="divider" />
        </div>
      </div>
    </div>

    <!-- featured recipes -->
    <div class="px-6 pb-3 pt-6 border-base-content/50 border rounded-4xl mb-4">
      <div class="flex items-center justify-between mb-6">
        <h2 class="font-header-2">
          FEATURED RECIPES
        </h2>
        <div class="flex gap-2">
          <button
            type="button"
            class="btn btn-circle btn-outline"
            @click="left"
          >
            ❮
          </button>

          <button
            type="button"
            class="btn btn-circle btn-outline"
            @click="right"
          >
            ❯
          </button>
        </div>
      </div>

      <div class="carousel w-full relative py-4">
        <div id="slide1" class="carousel-item relative w-full gap-4 flex-col md:flex-row">
          <div
            v-for="recipe in recipes.slice(0, 2)"
            :key="recipe.title"
            class="card bg-base-100 shadow-sm"
          >
            <figure>
              <img
                :src="recipe.imgUrl"
                :alt="recipe.title"
                class="object-cover md:h-70 lg:h-100 w-full"
              >
            </figure>
            <div class="card-body">
              <h2 class="card-title font-header-3">
                {{ recipe.title }}
              </h2>
              <p class="font-paragraph-2">
                {{ recipe.description }}
              </p>
              <div class="card-actions items-center justify-between">
                <div class="font-small-text mb-2 md:mb-0">
                  {{ recipe.prepTime }} - {{ recipe.ingredientsCount }} INGREDIENTS
                </div>
                <button class="btn btn-outline rounded-full self-end w-full md:w-fit">
                  VIEW RECIPE
                </button>
              </div>
            </div>
          </div>
        </div>
        <div id="slide2" class="carousel-item relative w-full gap-4 flex-col md:flex-row">
          <div
            v-for="recipe in recipes.slice(0, 2)"
            :key="recipe.title"
            class="card bg-base-100 shadow-sm"
          >
            <figure>
              <img
                :src="recipe.imgUrl"
                :alt="recipe.title"
                class="object-cover md:h-70 lg:h-100 w-full"
              >
            </figure>
            <div class="card-body">
              <h2 class="card-title font-header-3">
                {{ recipe.title }}
              </h2>
              <p class="font-paragraph-2">
                {{ recipe.description }}
              </p>
              <div class="card-actions items-start md:items-center flex-col justify-between md:flex-row">
                <div class="font-small-text mb-2 md:mb-0">
                  {{ recipe.prepTime }} - {{ recipe.ingredientsCount }} INGREDIENTS
                </div>
                <button class="btn btn-outline rounded-full self-end w-full md:w-fit">
                  VIEW RECIPE
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- SHOW-CASE -->
    <div class="mt-20 mb-16">
      <div class="max-w-xl text-center mx-auto mb-10">
        <div class="badge badge-primary font-button-text mb-2">
          RECIPES
        </div>
        <h2 class="font-header-2 mb-3">
          EMBARK ON A JOURNEY
        </h2>
        <p class="font-paragraph-2 mb-10">
          With our diverse collection of recipes we have something to satisfy every palate.
        </p>

        <!-- btns -->
        <div class="*:btn *:btn-outline *:rounded-full flex items-center justify-around flex-wrap gap-2">
          <button class="btn-active">
            All
          </button>
          <button>Breakfast</button>
          <button>Lunch</button>
          <button>
            Dinner
          </button>
          <button>Dessert</button>
          <button>quick bite!</button>
        </div>
      </div>
      <div class="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        <div
          v-for="recipe in [...recipes, ...recipes.map((r) => ({ ...r, title: `${r.title}2` }))]"
          :key="recipe.title"
          class="card bg-base-100 shadow-sm"
        >
          <figure>
            <img
              :src="recipe.imgUrl"
              :alt="recipe.title"
              class="object-cover md:h-70 lg:h-100 w-full"
            >
          </figure>
          <div class="card-body">
            <h2 class="card-title font-header-3">
              {{ recipe.title }}
            </h2>
            <p class="font-paragraph-2">
              {{ recipe.description }}
            </p>
            <div class="card-actions items-start md:items-center flex-col justify-between md:flex-row">
              <div class="font-small-text mb-2 md:mb-0">
                {{ recipe.prepTime }} - {{ recipe.ingredientsCount }} INGREDIENTS
              </div>
              <button class="btn btn-outline rounded-full self-end w-full md:w-fit">
                VIEW RECIPE
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- subscription -->
    <div class="relative min-h-[60vh] bg-success-content/75 px-4 rounded-4xl text-success text-center flex flex-col items-center justify-center">
      <div class="max-w-4xl space-y-3">
        <p class="font-tagline">
          SUBSCRIBE
        </p>
        <h1 class="font-headline-1">
          JOIN THE FUN <br>
          SUBSCRIBE NOW!
        </h1>
        <p class="font-paragraph-1 mb-12">
          Subscribe to our newsletter for a weekly serving of recipes, cooking tips, and exclusive insights straight to your inbox.
        </p>
      </div>
      <div class="join text-base-content bg-none rounded-full">
        <div>
          <label class="input validator rounded-l-full join-item">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
              <g
                stroke-linejoin="round"
                stroke-linecap="round"
                stroke-width="2.5"
                fill="none"
                stroke="currentColor"
              >
                <rect width="20" height="16" x="2" y="4" rx="2" />
                <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
              </g>
            </svg>
            <input type="email" placeholder="mail@site.com" required>
          </label>
          <div class="validator-hint text-success hidden">
            Enter valid email address
          </div>
        </div>
        <button class="btn btn-success rounded-r-full join-item">
          Join
        </button>
      </div>
    </div>
  </div>
</template>
