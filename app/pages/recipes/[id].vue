<script setup lang="ts">
import { onMounted, ref } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();
const copied = ref(false);
const currentUrl = ref("");

onMounted(() => {
  if (typeof window !== "undefined") {
    currentUrl.value = window.location.origin + route.fullPath;
  }
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
  <div
    class="border px-3 lg:px-10 border-base-content/50 rounded-4xl min-h-[80vh]"
  >
    <div class="mt-16 text-center max-w-3xl mx-auto space-y-3">
      <div class="badge badge-primary font-header-3 py-4">
        RECIPE
      </div>
      <h1 class="font-headline-1">
        {{ "Lemon Garlic Roasted Chicken".toUpperCase() }}
      </h1>
      <p class="font-paragraph-1">
        Welcome to Cooks Delight, where culinary dreams come alive! Today, we embark on a journey of flavors with a dish that promises to elevate your dining experience – our Citrus Infusion Delight: Lemon Garlic Roasted Chicken.
      </p>
    </div>
    <div class="*:font-subtitle text-center my-3 space-y-3">
      <div>1 HOUR</div>
      <div>BREAKFAST</div>
    </div>

    <!-- IMAGES -->
    <div class=" mx-auto space-y-3">
      <img src="/img/CImage.jpg" class="rounded-4xl mx-auto w-full" alt="placeholder">
      <div class="carousel rounded-4xl">
        <div id="slide1" class="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1625726411847-8cbb60cc71e6.webp"
            class="w-full"
          >
          <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide4" class="btn btn-circle">❮</a>
            <a href="#slide2" class="btn btn-circle">❯</a>
          </div>
        </div>
        <div id="slide2" class="carousel-item relative w-full">
          <img
            src="https://img.daisyui.com/images/stock/photo-1609621838510-5ad474b7d25d.webp"
            class="w-full"
          >
          <div class="absolute left-5 right-5 top-1/2 flex -translate-y-1/2 transform justify-between">
            <a href="#slide1" class="btn btn-circle">❮</a>
            <a href="#slide3" class="btn btn-circle">❯</a>
          </div>
        </div>
      </div>

      <!-- INSTRUCTION -->
      <div class="flex flex-col items-start *:w-full lg:gap-0 gap-6 *:flex-1 lg:pt-10 pt-5 lg:flex-row">
        <div>
          <h1 class="font-header-2 mb-10">
            INSTRUCTIONS
          </h1>
          <div>
            <div
              v-for="step in Array.from({ length: 5 }).map((_, i) => ({ step_no: i, step_description: 'something to describe' }))"
              :key="step.step_no" class="mb-3"
            >
              <h3 class="font-subtitle text-primary mb-4">
                Step {{ step.step_no + 1 }}
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
            <li v-for="ing in Array.from({ length: 5 }).map((_, i) => ({ ingredient: `ingredient ${i + 1}` }))" :key="ing.ingredient" class="list-item list-disc ml-4 mb-3">
              {{ ing.ingredient }}
            </li>
          </ul>
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
      <img src="/img/Author Image.png" class="w-50" alt="author img">
      <div class="flex-1">
        <div class="font-bold-text mb-3">
          Isabella Russo
        </div>
        <p class="font-paragraph-2">
          In the world of pots and pans, I'm on a mission to turn every meal into a masterpiece. Cooks Delight is not just a blog; it's a shared space where the love for food transcends boundaries. Here, we celebrate the art of crafting meals that not only nourish the body but also feed the soul.
        </p>
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
