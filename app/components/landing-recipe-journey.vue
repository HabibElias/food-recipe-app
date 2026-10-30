<script setup lang="ts">
import type { LandingRecipe } from "~~/shared/types/LandingRecipe";

const props = defineProps<{
  recipe: LandingRecipe;
  recipeLink: string | { path: string; query: { search: string } };
}>();
const user = useUserStore();
const root = ref<HTMLElement | null>(null);
const phase = ref(0);
let pageFrame = 0;
function updateScroll() {
  pageFrame = 0;
  if (desktop?.matches || !root.value || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
  const box = root.value.getBoundingClientRect();
  const travel = root.value.offsetHeight - window.innerHeight;
  if (travel > 0) phase.value = Math.max(0, Math.min(2, Math.floor((-box.top / travel) * 3)));
}
function pageScroll() { if (!pageFrame) pageFrame = requestAnimationFrame(updateScroll); }
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
  if (!desktop?.matches) updateScroll();
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

function carouselKey(event: KeyboardEvent) {
  if (desktop?.matches || event.target !== event.currentTarget) return;
  if (!["ArrowLeft", "ArrowRight", "Home", "End"].includes(event.key)) return;
  event.preventDefault();
  select(event.key === "Home" ? 0 : event.key === "End" ? 2 : phase.value + (event.key === "ArrowRight" ? 1 : -1));
}
function select(index: number) {
  phase.value = Math.max(0, Math.min(steps.length - 1, index));
  index = phase.value;
  if (!desktop?.matches && root.value && !window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    const top = window.scrollY + root.value.getBoundingClientRect().top;
    const travel = root.value.offsetHeight - window.innerHeight;
    window.scrollTo({ top: top + travel * ((index + .35) / 3), behavior: "smooth" });
  }
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
  window.addEventListener("scroll", pageScroll, { passive: true });
  window.addEventListener("resize", pageScroll);
});
onBeforeUnmount(() => { observer?.disconnect(); window.removeEventListener("scroll", pageScroll); window.removeEventListener("resize", pageScroll); cancelAnimationFrame(pageFrame); desktop?.removeEventListener("change", observeChapters); });
</script>

<template>
  <section id="how-it-works" ref="root" class="recipe-journey" aria-labelledby="journey-title">
    <div class="site-frame journey-stage">
      <header class="landing-section-heading journey-heading">
        <h2 id="journey-title">From an idea<br> to your table.</h2>
        <p>One recipe. Three little moments.<br> Here's how a good meal finds its way into your kitchen.</p>
      </header>
      <div class="journey-layout">
        <div class="journey-chapters" tabindex="0" role="region" aria-roledescription="scroll-driven story" aria-label="Find, save, and cook"  @keydown="carouselKey">
          <article v-for="(step,index) in steps" :key="step.verb" :data-chapter="index" class="journey-chapter" role="group" aria-roledescription="slide" :aria-label="`${index + 1} of ${steps.length}: ${step.verb}`" :class="{ 'is-current': phase === index }">
            <span class="journey-step-number" aria-hidden="true">{{ index + 1 }}</span>
            <h3>{{ step.title }}</h3><p class="journey-long-copy">{{ step.body }}</p><p class="journey-short-copy">{{ ["Find a dish that fits your ingredients and the time you have.", "Keep your favorites in your own recipe book, ready for next time.", "Tick off ingredients and follow one clear step at a time."][index] }}</p>
            <NuxtLink :to="index === 2 ? recipeLink : index === 1 && user.isLoggedIn ? '/bookmarks' : step.to" class="text-link">{{ index === 1 && user.isLoggedIn ? 'Open your recipe book' : step.action }}<Icon name="lucide:arrow-up-right" size="18" /></NuxtLink>
          </article>
        </div>
        <figure class="journey-figure">
          <div class="journey-controls" role="group" aria-label="Explore the recipe journey">
            <button v-for="(step,index) in steps" :key="step.verb" type="button" :aria-label="'Preview '+step.verb.toLowerCase()" :aria-pressed="phase === index" aria-controls="recipe-preview" @click="select(index)"><span>{{ index + 1 }}</span>{{ step.verb }}</button>
          </div>
          <div id="recipe-preview" class="journey-preview" :data-phase="phase" data-ui aria-label="Interactive recipe preview">
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
          <figcaption>A hands-on preview from Bowlup Kitchen. Try the controls, then open the full recipe to make it your own.</figcaption>
        </figure>
      </div>
    </div>
  </section>
</template>
