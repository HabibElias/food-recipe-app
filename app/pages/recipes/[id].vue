<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

import useRecipe from "~/composables/useRecipe";

const route = useRoute();
const userStore = useUserStore();

const { selectedRating, onRatingChange, submitRating, ratingMessage, recipe, likesCount, addComment, liking, buyRecipe, loadRecipe, loading, posting, toggleLike, userHasLiked, newComment } = useRecipe(String(route.params.id));

const copied = ref(false);
const currentUrl = ref("");

onMounted(() => {
  if (typeof window !== "undefined") {
    currentUrl.value = window.location.origin + route.fullPath;
  }
  loadRecipe();
});

async function copyLink() {
  try {
    await navigator.clipboard.writeText(currentUrl.value);
    copied.value = true;
    setTimeout(() => (copied.value = false), 1500);
  }
  catch (err) {
    console.error("Failed to copy:", err);
  }
}
</script>

<template>
  <div>
    <div class="border border-base-content/50 px-3 lg:px-10 rounded-4xl min-h-[80vh]">
      <div class="mt-16 text-center max-w-3xl mx-auto space-y-3">
        <div class="badge badge-primary font-header-3 py-4">
          RECIPE
        </div>
        <h1 class="font-headline-1">
          <span v-if="loading" class="skeleton h-10 w-3/4 mx-auto rounded-2xl" />
          <span v-else>{{ recipe?.title.toUpperCase() }}</span>
        </h1>
        <p class="font-paragraph-1">
          <span v-if="loading" class="skeleton h-5 w-full rounded-2xl block mb-2" />
          <span v-if="loading" class="skeleton h-5 w-5/6 rounded-2xl block mx-auto" />
          <span v-else>{{ recipe?.description }}</span>
        </p>
      </div>
      <div class="*:font-bold-text text-center my-3 space-y-3 flex justify-center">
        <div class="w-fit flex items-center gap-4 justify-center">
          <icon name="lucide:timer" />
          <span v-if="loading" class="skeleton h-5 w-16 rounded-2xl" />
          <span v-else>{{ recipe?.prep_time }} MIN</span>
        </div>
        <div class="divider divider-horizontal" />
        <div>
          <span v-if="loading" class="skeleton h-5 w-24 rounded-2xl inline-block" />
          <span v-else>{{ recipe?.category.category_name.toUpperCase() }}</span>
        </div>
      </div>
      <div class="mx-auto w-fit">
        <AppStarRating v-if="recipe" :value="recipe.recipe_ratings_aggregate.aggregate.avg.rating" readonly />
      </div>

      <div class="mt-4 mx-auto space-y-3">
        <!-- IMAGES -->
        <div v-if="loading" class="rounded-4xl mx-auto w-full">
          <div class="skeleton rounded-4xl h-150 w-full" />
        </div>
        <div v-else>
          <div
            class="hero min-h-[80vh] rounded-4xl bg-no-repeat bg-center"
            :style="{ backgroundImage: `url(${recipe?.recipe_images?.find(i => i.is_thumbnail)?.img_url || recipe?.recipe_images?.[0]?.img_url || 'https://orders.goodthymes.ca/assets/img/goodthymes/default-menu-image-placeholder.png'})` }"
          >
            <div v-if="recipe?.user_id !== userStore.user?.id && (recipe?.is_paid && (recipe?.payments?.length ?? 0) <= 0)" class="hero-overlay rounded-4xl" />
            <div v-if="recipe?.user_id !== userStore.user?.id && (recipe?.is_paid && (recipe?.payments?.length ?? 0) <= 0)" class="hero-content text-neutral-content text-center z-10">
              <div class="max-w-fit">
                <p class="mb-5 font-paragraph-1 font-light">
                  This recipe is premium. Unlock it for only {{ recipe?.price }} ETB.
                </p>
                <button
                  class="btn btn-primary rounded-full px-6"
                  @click="buyRecipe"
                >
                  Buy Recipe
                </button>
              </div>
            </div>
          </div>
          <div v-if="recipe?.recipe_images && recipe.recipe_images.length > 1" class="carousel rounded-4xl mt-6 max-h-[70vh]">
            <div
              v-for="(img, idx) in recipe.recipe_images.slice(1)"
              :id="`slide-${idx + 1}`"
              :key="img.id"
              class="carousel-item relative w-full"
            >
              <img :src="img.img_url" class="w-full object-cover">
              <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
                <a :href="`#slide-${((idx - 1 + recipe.recipe_images.length) % recipe.recipe_images.length) + 1}`" class="btn btn-circle">❮</a>
                <a :href="`#slide-${((idx + 1) % recipe.recipe_images.length) + 1}`" class="btn btn-circle">❯</a>
              </div>
            </div>
          </div>
        </div>

        <!-- LIKE + BUY CTA -->
        <div class="flex items-center justify-between gap-4 mt-4">
          <button
            class="btn rounded-full"
            :class="[userHasLiked ? 'btn-primary' : 'btn-outline']"
            :disabled="liking || loading"
            @click="toggleLike"
          >
            <icon :name="userHasLiked ? 'lucide:heart' : 'lucide:heart'" />
            <span>{{ likesCount }}</span>
            <span v-if="liking" class="loading loading-spinner loading-xs ml-2" />
          </button>
        </div>

        <!-- INSTRUCTION -->
        <div v-if="!loading && (recipe?.user_id === userStore.user?.id || !recipe?.is_paid || (recipe?.payments?.length ?? 0) > 0)" class="flex flex-col items-start *:w-full lg:gap-0 gap-6 *:flex-1 lg:pt-10 pt-5 lg:flex-row">
          <div>
            <h1 class="font-header-2 mb-10">
              INSTRUCTIONS
            </h1>
            <div>
              <div
                v-for="step in recipe?.recipe_steps"
                :key="step.step_no" class="mb-3"
              >
                <h3 class="font-subtitle text-primary mb-4">
                  Step {{ step.step_no }}
                </h3>
                <p class="font-paragraph-2 list-item ml-5">
                  {{ step.step_description }}
                </p>
              </div>
            </div>
          </div>
          <div class="space-y-3 bg-background p-10 border border-base-content/50 rounded-4xl">
            <div class="font-subtitle text-primary">
              INGREDIENTS
            </div>
            <ul class="list">
              <li v-for="ing in recipe?.recipe_ingredients" :key="ing.id" class="list-item list-disc ml-4 mb-3">
                {{ ing.ingredient }}
              </li>
            </ul>
          </div>
        </div>
        <div v-else-if="loading" class="lg:pt-10 pt-5 space-y-4">
          <div class="skeleton h-6 w-40" />
          <div class="space-y-3">
            <div class="skeleton h-4 w-full" />
            <div class="skeleton h-4 w-5/6" />
            <div class="skeleton h-4 w-2/3" />
          </div>
        </div>
      </div>

      <div
        class="flex items-center w-fit gap-3 border border-base-content/50 rounded-full px-4 py-2 my-10 btn btn-outline"
        @click="copyLink"
      >
        <span class="text-sm tracking-wide font-medium text-base-content">SHARE</span>

        <div class="flex items-center gap-3">
          <!-- Facebook -->
          <Icon name="uil:facebook-f" />

          <!-- Instagram -->
          <Icon name="uil:instagram" />

          <!-- YouTube -->
          <Icon name="uil:youtube" />
        </div>
        <transition name="fade">
          <span
            v-if="copied"
            class="ml-2 text-xs text-base-content px-2 py-1 rounded shadow-sm"
          >
            Copied!
          </span>
        </transition>
      </div>

      <div class="divider" />

      <!-- USER -->
      <div class="flex gap-4 mb-4 lg:flex-row flex-col">
        <div v-if="recipe?.user?.avatar_url" class="avatar">
          <div class="w-24 rounded">
            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp">
          </div>
        </div>
        <div v-else class="avatar avatar-placeholder h-fit">
          <div class="bg-neutral text-neutral-content w-24 rounded-full">
            <span class="text-3xl">{{ recipe?.user?.FirstName.slice(0, 1) }}</span>
          </div>
        </div>
        <div>
          <div class="font-bold-text mb-3">
            {{ recipe?.user?.FirstName }} {{ recipe?.user?.LastName }}
          </div>
          <p class="font-paragraph-2">
            {{ recipe?.user?.bio }}
          </p>
          <button class="btn btn-outline rounded-full justify-self-end mt-6">
            Learn More
          </button>
        </div>
      </div>
    </div>

    <div class="my-4 border border-base-content/50 px-3 lg:px-10 py-6 rounded-4xl space-y-4">
      <div v-if="recipe && !recipe.recipe_ratings.find(val => val.user.username === userStore.user?.username)">
        <div class="font-header-3 mb-4">
          Rate Here
        </div>
        <AppStarRating v-model="selectedRating" :max-stars="5" @rating-data="onRatingChange" />
        <div class="mt-3">
          <button
            class="btn btn-outline rounded-full"
            :disabled="!userStore.user || !selectedRating || loading"
            @click="submitRating"
          >
            <span v-if="!userStore.user">Login to rate</span>
            <span v-else-if="!selectedRating">Select rating</span>
            <span v-else>Submit</span>
          </button>
          <div v-if="ratingMessage" class="text-sm mt-2 text-warning">
            {{ ratingMessage }}
          </div>
        </div>
      </div>
      <div v-if="recipe && recipe?.recipe_ratings.length >= 1" class="space-y-4">
        <div class="font-header-3 mb-4">
          Ratings
        </div>
        <div v-for="rated in recipe?.recipe_ratings" :key="rated.user.username" class="flex items-center gap-4">
          <div>
            <div v-if="rated?.user.avatar_url ?? false" class="avatar">
              <div class="w-12 rounded">
                <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp">
              </div>
            </div>
            <div v-else class="avatar avatar-placeholder h-fit">
              <div class="bg-neutral text-neutral-content w-12 rounded-full">
                <span class="text-xl">{{ rated?.user.FirstName.slice(0, 1).toUpperCase() }}</span>
              </div>
            </div>
          </div>
          <p class="font-paragraph-3">
            @{{ rated.user.username }}
          </p>
          <AppStarRating :value="rated.rating" readonly />
        </div>
      </div>
      <div v-else>
        <div class="text-base-content/70">
          No Ratings yet. Be the first to share your ratings!
        </div>
      </div>
    </div>

    <div class="border border-base-content/50 rounded-4xl mt-4 px-3 lg:px-10 py-6">
      <div class="font-header-3 mb-4">
        Comments
      </div>

      <div v-if="userStore.user" class="flex items-start gap-3 mb-6">
        <div v-if="userStore.user.avatar_url" class="avatar">
          <div class="w-12 rounded">
            <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp">
          </div>
        </div>
        <div v-else class="avatar avatar-placeholder h-fit">
          <div class="bg-neutral text-neutral-content w-12 rounded-full">
            <span class="text-xl">{{ userStore.user.FirstName.slice(0, 1).toUpperCase() }}</span>
          </div>
        </div>
        <div class="flex-1">
          <textarea
            v-model="newComment"
            class="textarea textarea-bordered w-full"
            rows="2"
            placeholder="Write a comment..."
          />
          <div class="mt-2 flex justify-end">
            <button class="btn btn-primary btn-sm rounded-full" :disabled="posting || !newComment.trim()" @click="addComment">
              <span v-if="posting" class="loading loading-spinner loading-xs" />
              <span v-else>Post</span>
            </button>
          </div>
        </div>
      </div>
      <div v-else class="alert mb-4">
        <div>
          <span>Please log in to leave a comment.</span>
        </div>
      </div>

      <div v-if="loading">
        <div v-for="i in 3" :key="i" class="flex gap-3 items-start mb-4">
          <div class="skeleton w-12 h-12 rounded-full" />
          <div class="flex-1">
            <div class="skeleton h-4 w-32 mb-2" />
            <div class="skeleton h-4 w-full mb-1" />
            <div class="skeleton h-4 w-4/5" />
          </div>
        </div>
      </div>
      <div v-else class="space-y-4">
        <div v-if="recipe?.recipe_comments?.length === 0" class="text-base-content/70">
          No comments yet. Be the first to share your thoughts!
        </div>
        <div
          v-for="c in recipe?.recipe_comments"
          :key="c.id"
          class="flex gap-3 items-start"
        >
          <div v-if="recipe?.user.avatar_url ?? false" class="avatar">
            <div class="w-12 rounded">
              <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp">
            </div>
          </div>
          <div v-else class="avatar avatar-placeholder h-fit">
            <div class="bg-neutral text-neutral-content w-12 rounded-full">
              <span class="text-xl">{{ c.user?.FirstName?.slice(0, 1).toUpperCase() }}</span>
            </div>
          </div>
          <div class="flex-1">
            <div class="font-small-text text-base-content/70">
              {{ c.user?.username || 'Anonymous' }} · {{ new Date(c.created_at).toLocaleString() }}
            </div>
            <div class="font-paragraph-2">
              {{ c.comment_body }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
