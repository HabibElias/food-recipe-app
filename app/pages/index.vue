<script lang="ts" setup>
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

const client = useApolloClient().client;

const GET_RECIPE_QUERY = gql`
query recipe($limit: Int!) {
  recipe(limit: $limit) {
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
  const { data } = await client.query<{ recipe: Recipe[] }>({
    query: GET_RECIPE_QUERY,
    variables: { limit: 4 },
  });

  recipes.value = data.recipe;
  console.log(data);
}
catch (err) {
  console.error(err);
}
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
          <nuxt-link to="/dashboard" class="btn btn-primary rounded-full font-button-text">
            Get Started
          </nuxt-link>
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
        <div id="slide1" class="carousel-item relative w-full gap-4 flex-col md:flex-row *:flex-1">
          <app-recipe-card
            v-for="recipe in recipes.slice(0, 2)"
            :key="recipe.title"
            :recipe="recipe"
          />
        </div>
        <div id="slide2" class="carousel-item relative w-full gap-4 flex-col md:flex-row *:flex-1">
          <app-recipe-card
            v-for="recipe in recipes.slice(0, 2)"
            :key="recipe.title"
            :recipe="recipe"
          />
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
        <app-recipe-card
          v-for="recipe in [...recipes, ...recipes.map((r) => ({ ...r, title: `${r.title}2` }))]"
          :key="recipe.title"
          :recipe="recipe"
        />
      </div>
    </div>
  </div>
</template>
