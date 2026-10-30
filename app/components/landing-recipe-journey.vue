<script setup lang="ts">
import type { LandingRecipe } from "~~/shared/types/LandingRecipe";
const props = defineProps<{ recipe: LandingRecipe; recipeLink: string | { path: string; query: { search: string } } }>();
const root = ref<HTMLElement | null>(null);
const phase = ref(0);
const progress = ref(0);
const pinned = ref(false);
const saved = ref(false);
const user = useUserStore();
const chapters = [
 { name: "Find", title: "Find your kind of good.", copy: "A familiar favorite. Something you've never tried. Find the recipe that feels like tonight.", action: "Explore the recipes", to: "/browse" },
 { name: "Save", title: "Keep a little inspiration.", copy: "The meals you want to make again, together in your own recipe book. Ready when you are.", action: "Make your recipe book", to: "/auth/sign-up" },
 { name: "Cook", title: "Make it your own.", copy: "Real ingredients. Clear steps. A little confidence, from the first chop to the last bite.", action: "Cook this recipe", to: "" },
];
let frame = 0;
let focusGuard = 0;
let preference: MediaQueryList | undefined;
function update() {
 frame = 0;
 if (!root.value) return;
 const box = root.value.getBoundingClientRect();
 const distance = root.value.offsetHeight - window.innerHeight;
 pinned.value = !preference?.matches && box.top <= 1 && box.bottom >= window.innerHeight - 1;
 if (preference?.matches || distance <= 0 || performance.now() < focusGuard) return;
 progress.value = Math.max(0, Math.min(1, -box.top / distance));
 phase.value = Math.min(2, Math.floor(progress.value * 3));
}
function preserveFocusPosition() {
 if (!pinned.value || !root.value || preference?.matches) return;
 const top = window.scrollY + root.value.getBoundingClientRect().top;
 const distance = root.value.offsetHeight - window.innerHeight;
 focusGuard = performance.now() + 150;
 requestAnimationFrame(() => window.scrollTo({ top: top + distance * ((phase.value + .45) / 3), behavior: "instant" }));
}
function onScroll() { if (!frame) frame = requestAnimationFrame(update); }
function choose(index: number) {
 phase.value = index;
 progress.value = (index + .45) / 3;
 if (!root.value || preference?.matches) return;
 const top = window.scrollY + root.value.getBoundingClientRect().top;
 window.scrollTo({ top: top + (root.value.offsetHeight - window.innerHeight) * ((index + .45) / 3), behavior: "smooth" });
}
function key(event: KeyboardEvent) {
 if (event.key === "ArrowRight" || event.key === "ArrowLeft") {
  event.preventDefault();
  choose(Math.max(0, Math.min(2, phase.value + (event.key === "ArrowRight" ? 1 : -1))));
 }
}
onMounted(() => {
 preference = window.matchMedia("(prefers-reduced-motion: reduce)");
 preference.addEventListener("change", update);
 window.addEventListener("scroll", onScroll, { passive:true });
 window.addEventListener("resize", onScroll);
 update();
});
onBeforeUnmount(() => {
 cancelAnimationFrame(frame);
 window.removeEventListener("scroll", onScroll);
 window.removeEventListener("resize", onScroll);
 preference?.removeEventListener("change", update);
});
</script>
<template>
 <section id="how-it-works" ref="root" class="meal-story" :class="{ 'is-pinned': pinned }" aria-labelledby="meal-story-title" :style="{ '--meal-progress': progress }">
  <div class="meal-stage" :data-phase="phase" @focusin="preserveFocusPosition">
   <div class="meal-narrative">
    <div v-for="(chapter,index) in chapters" :key="chapter.name" class="meal-message" :class="{ 'is-active': phase === index }" :inert="phase !== index" :aria-hidden="phase !== index">
     <h2 :id="phase === index ? 'meal-story-title' : undefined">{{ chapter.title }}</h2>
     <p>{{ chapter.copy }}</p>
     <NuxtLink :to="index === 2 ? recipeLink : index === 1 && user.isLoggedIn ? '/bookmarks' : chapter.to" class="meal-action">{{ index === 1 && user.isLoggedIn ? 'Open your recipe book' : chapter.action }}<Icon name="lucide:arrow-up-right" size="21" /></NuxtLink>
    </div>
   </div>
   <figure class="meal-visual">
    <div class="meal-image"><img :src="recipe.image" :alt="recipe.title" width="1000" height="1000" loading="lazy"></div>
    <button v-if="phase === 1" type="button" class="meal-save" @pointerdown.prevent :aria-pressed="saved" @click="saved = !saved"><Icon :name="saved ? 'lucide:bookmark-check' : 'lucide:bookmark'" size="20" />{{ saved ? 'Saved in this preview' : 'Try saving this recipe' }}</button>
    <figcaption><span>{{ recipe.title }}</span><span>{{ phase === 1 ? 'A little inspiration for later.' : phase === 2 ? 'Your next good meal.' : `${recipe.minutes} minutes. Something worth making.` }}</span></figcaption>
   </figure>
   <nav class="meal-timeline" aria-label="Explore how Bowlup works" @keydown="key">
    <button v-for="(chapter,index) in chapters" :key="chapter.name" type="button" :aria-current="phase === index ? 'step' : undefined" :aria-label="`Explore ${chapter.name.toLowerCase()}`" @click="choose(index)"><span>{{ chapter.name }}</span><span class="meal-track" aria-hidden="true"><span :style="{ transform: `scaleX(${Math.max(0, Math.min(1, progress * 3 - index))})` }" /></span></button>
    <span class="meal-scroll-cue">Scroll to discover<Icon name="lucide:arrow-down" size="17" /></span>
   </nav>
  </div>
 </section>
</template>
