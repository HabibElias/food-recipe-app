<script setup lang="ts">
import type { LandingRecipe } from "~~/shared/types/LandingRecipe";

const props = defineProps<{
  recipe: LandingRecipe;
  recipeLink: string | { path: string; query: { search: string } };
}>();
const user = useUserStore();
const root = ref<HTMLElement | null>(null);
const phase = ref(0);
const track = ref<HTMLElement | null>(null);
let touchStart: { x: number; y: number } | undefined;
let scrollFrame = 0;
const checked = ref<string[]>([]);
const steps = [
  { verb: "Find", title: "Find a little inspiration.", body: "Start with what sounds good. Look for a dish, choose the time you have, or explore a familiar ingredient. A thirty-minute skillet is a good place to begin.", action: "Find your next recipe", to: "/browse" },
  { verb: "Save", title: "Keep the good ones.", body: "Found something you'd make again? Save it to your own recipe book. Your favorites wait together, ready for the next time someone asks what's for dinner.", action: "Start your recipe book", to: "/auth/sign-up" },
  { verb: "Cook", title: "Cook at your own pace.", body: "Check what goes into the pan. Read one clear step at a time. Tick off ingredients as you go, and leave a note when you've made it your own.", action: "Cook this recipe", to: "" },
];
let observer: IntersectionObserver | undefined;
let desktop: MediaQueryList | undefined;

function observeChapters() {
  observer?.disconnect();
  if (!desktop?.matches) nextTick(() => scrollToPhase(false));
  if (!desktop?.matches || !root.value || !("IntersectionObserver" in window)) return;
  const chapters = Array.from(root.value.querySelectorAll<HTMLElement>("[data-chapter]"));
  observer = new IntersectionObserver(() => {
    // Entries contain only changed intersections, not every visible chapter.
    // Compare all chapter centers so forward scrolling cannot select an older beat.
    const middle = window.innerHeight / 2;
    const closest = chapters.reduce((best, chapter) => {
      const box = chapter.getBoundingClientRect();
      const distance = Math.abs(box.top + box.height / 2 - middle);
      return distance < best.distance ? { chapter, distance } : best;
    }, { chapter: chapters[0]!, distance: Infinity });
    phase.value = Number(closest.chapter.dataset.chapter);
  }, { rootMargin: "-28% 0px -28% 0px", threshold: [0, .25, .5, .75, 1] });
  root.value.querySelectorAll("[data-chapter]").forEach(chapter => observer?.observe(chapter));
}

function scrollToPhase(smooth = true) {
  const card = track.value?.children[phase.value] as HTMLElement | undefined;
  if (!track.value || !card || desktop?.matches) return;
  track.value.scrollTo({ left: card.offsetLeft - (track.value.children[0] as HTMLElement).offsetLeft,
    behavior: smooth && !window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "smooth" : "instant" });
}
function trackScroll() {
  if (desktop?.matches || scrollFrame) return;
  scrollFrame = requestAnimationFrame(() => {
    scrollFrame = 0;
    if (!track.value) return;
    const cards = Array.from(track.value.children) as HTMLElement[];
    const origin = cards[0]!.offsetLeft;
    phase.value = cards.reduce((best, card, index) => Math.abs(card.offsetLeft - origin - track.value!.scrollLeft) < Math.abs(cards[best]!.offsetLeft - origin - track.value!.scrollLeft) ? index : best, 0);
  });
}
function touchBegin(event: TouchEvent) {
  if (desktop?.matches || (event.target as HTMLElement).closest("a,button,input,label")) return;
  const point = event.touches[0];
  if (point) touchStart = { x: point.clientX, y: point.clientY };
}
function touchEnd(event: TouchEvent) {
  const point = event.changedTouches[0];
  if (touchStart && point) {
    const dx = point.clientX - touchStart.x;
    const dy = point.clientY - touchStart.y;
    if (Math.abs(dx) > 48 && Math.abs(dx) > Math.abs(dy) * 1.4) select(phase.value + (dx < 0 ? 1 : -1));
  }
  touchStart = undefined;
}
function carouselKey(event: KeyboardEvent) {
  if (desktop?.matches || event.target !== event.currentTarget) return;
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  select(event.key === "Home" ? 0 : event.key === "End" ? 2 : phase.value + (event.key === "ArrowRight" ? 1 : -1));
}
function select(index: number) {
  phase.value = Math.max(0, Math.min(steps.length - 1, index));
  index = phase.value;
  if (!desktop?.matches) scrollToPhase();
  if (desktop?.matches) {
    root.value?.querySelector(`[data-chapter="${index}"]`)?.scrollIntoView({
      block: "center", behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth",
    });
  }
}

onMounted(() => {
  desktop = window.matchMedia("(min-width: 901px) and (min-height: 820px)");
  desktop.addEventListener("change", observeChapters);
  observeChapters();
});
onBeforeUnmount(() => { observer?.disconnect(); cancelAnimationFrame(scrollFrame); desktop?.removeEventListener("change", observeChapters); });
</script>

<template>
  <section id="how-it-works" ref="root" class="recipe-journey" aria-labelledby="journey-title">
    <div class="site-frame">
      <header class="landing-section-heading journey-heading">
        <h2 id="journey-title">From an idea<br>to your table.</h2>
        <p>One recipe. Three little moments.<br>Here's how a good meal finds its way into your kitchen.</p>
      </header>
      <div class="journey-layout">
        <div ref="track" class="journey-chapters" tabindex="0" role="region" aria-roledescription="carousel" aria-label="Find, save, and cook" @scroll.passive="trackScroll" @keydown="carouselKey">
          <article v-for="(step,index) in steps" :key="step.verb" :data-chapter="index" class="journey-chapter" role="group" aria-roledescription="slide" :aria-label="`${index + 1} of ${steps.length}: ${step.verb}`" :class="{ 'is-current': phase === index }">
            <span class="journey-step-number" aria-hidden="true">{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3><p>{{ step.body }}</p>
            <NuxtLink :to="index === 2 ? recipeLink : index === 1 && user.isLoggedIn ? '/bookmarks' : step.to" class="text-link">{{ index === 1 && user.isLoggedIn ? 'Open your recipe book' : step.action }}<Icon name="lucide:arrow-up-right" size="18" /></NuxtLink>
          </article>
        </div>
        <figure class="journey-figure">
          <div class="journey-controls" role="group" aria-label="Explore the recipe journey">
            <button v-for="(step,index) in steps" :key="step.verb" type="button" :aria-label="'Preview '+step.verb.toLowerCase()" :aria-pressed="phase === index" aria-controls="recipe-preview" @click="select(index)"><span>{{ index + 1 }}</span>{{ step.verb }}</button>
          </div>
          <div id="recipe-preview" class="journey-preview" :data-phase="phase" data-ui aria-label="Interactive recipe preview" @touchstart.passive="touchBegin" @touchend.passive="touchEnd" @touchcancel="touchStart = undefined">
            <div class="saved-leaf" aria-hidden="true"><span>Your recipe book</span><span>Something worth making again.</span></div>
            <article class="journey-sheet">
              <div class="journey-sheet-photo"><img :src="recipe.image" :alt="recipe.title" width="660" height="500" loading="lazy"></div>
              <div class="journey-sheet-title"><h3>{{ recipe.title }}</h3><span>{{ recipe.minutes }} min · {{ recipe.ingredients.length }} ingredients</span></div>
              <svg class="journey-bookmark" :class="{ 'is-saved': phase === 1 }" viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M19 21 12 17 5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2Z" /></svg>
              <p class="journey-sheet-description" :aria-hidden="phase === 2">{{ recipe.description }}</p>
              <div class="journey-saved-note" :aria-hidden="phase !== 1"><Icon name="lucide:check" size="17" /><span>Saved in this preview</span></div>
              <div class="journey-cooking" :inert="phase !== 2" :aria-hidden="phase !== 2">
                <p class="journey-cooking-heading">A few things you'll need</p>
                <label v-for="ingredient in recipe.ingredients.slice(0,3)" :key="ingredient"><input v-model="checked" type="checkbox" :value="ingredient"><span>{{ ingredient }}</span></label>
                <div class="journey-first-step"><strong>Start here.</strong><p>{{ recipe.steps[0] }}</p></div>
              </div>
              <NuxtLink :to="recipeLink" class="journey-recipe-link">{{ phase === 2 ? 'See the full recipe' : 'From Bowlup Kitchen' }}<Icon name="lucide:arrow-up-right" size="17" /></NuxtLink>
            </article>
          </div>
          <div class="journey-carousel-navigation" aria-label="Carousel navigation">
            <button type="button" class="journey-carousel-arrow" :disabled="phase === 0" aria-label="Previous journey slide" @click="select(phase - 1)"><Icon name="lucide:arrow-left" size="20" /></button>
            <div class="journey-carousel-progress"><button v-for="(step,index) in steps" :key="step.verb" type="button" :aria-label="`Go to ${step.verb.toLowerCase()}`" :aria-current="phase === index ? 'step' : undefined" @click="select(index)"><span /></button></div>
            <span class="journey-carousel-status" aria-live="polite" aria-atomic="true">{{ phase + 1 }} / {{ steps.length }}</span>
            <button type="button" class="journey-carousel-arrow" :disabled="phase === steps.length - 1" aria-label="Next journey slide" @click="select(phase + 1)"><Icon name="lucide:arrow-right" size="20" /></button>
          </div>
          <figcaption>A hands-on preview from Bowlup Kitchen. Try the controls, then open the full recipe to make it your own.</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
