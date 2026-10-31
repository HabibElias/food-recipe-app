import type { Ref } from "vue";

export function useLandingContinuity(root: Ref<HTMLElement | null>) {
  let frame = 0;
  let preference: MediaQueryList | undefined;
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  function update() {
    frame = 0;
    const page = root.value;
    if (!page) return;
    const hero = page.querySelector<HTMLElement>(".photo-opening");
    const story = page.querySelector<HTMLElement>(".meal-story");
    if (!hero || !story) return;
    if (preference?.matches) {
      page.style.setProperty("--hero-exit", "0");
      page.style.setProperty("--story-entry", "1");
      return;
    }
    const heroBox = hero.getBoundingClientRect();
    const storyBox = story.getBoundingClientRect();
    const exit = clamp(-heroBox.top / heroBox.height);
    const entry = clamp((window.innerHeight - storyBox.top) / (window.innerHeight * .9));
    page.style.setProperty("--hero-exit", String(exit));
    page.style.setProperty("--story-entry", String(entry));
  }
  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  onMounted(() => {
    preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    schedule();
  });
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    preference?.removeEventListener("change", schedule);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  });
}
