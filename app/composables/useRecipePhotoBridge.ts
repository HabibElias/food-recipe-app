import type { Ref } from "vue";

/** Keep the selected meal continuous as the introduction becomes a recipe sheet. */
export function useRecipePhotoBridge(root: Ref<HTMLElement | null>) {
  let frame = 0;
  let preference: MediaQueryList | undefined;
  let observer: ResizeObserver | undefined;
  const clamp = (value: number) => Math.max(0, Math.min(1, value));

  function reset() {
    root.value?.classList.remove("is-photo-transferring");
    root.value?.style.removeProperty("--recipe-arrival");
    const transfer = root.value?.querySelector<HTMLElement>(".recipe-photo-transfer");
    if (transfer) transfer.style.visibility = "hidden";
  }

  function update() {
    frame = 0;
    const page = root.value;
    if (!page || preference?.matches) { reset(); return; }
    const source = page.querySelector<HTMLElement>(".hero-dish-photo");
    const section = page.querySelector<HTMLElement>(".meal-story");
    const target = page.querySelector<HTMLImageElement>(".meal-card-photo");
    const transfer = page.querySelector<HTMLElement>(".recipe-photo-transfer");
    const photo = transfer?.querySelector<HTMLImageElement>("img");
    if (!source || !section || !target || !transfer || !photo) return;

    const sectionTop = section.getBoundingClientRect().top;
    const sectionStart = sectionTop + window.scrollY;
    const travel = Math.max(1, Math.min(window.innerHeight * .85, sectionStart - Math.min(120, window.innerHeight * .15)));
    const progress = clamp(1 - sectionTop / travel);
    // Phones and short landscape windows keep the photo in its own card, away
    // from the search controls. The sheet opens as it enters the viewport.
    if (window.innerWidth <= 760 || window.innerHeight < 600) {
      reset();
      const arrival = clamp((window.innerHeight - sectionTop) / (window.innerHeight * .7));
      page.style.setProperty("--recipe-arrival", String(arrival));
      return;
    }
    if (sectionTop >= travel - 1 || sectionTop <= 1 || !photo.complete || !photo.naturalWidth) {
      reset();
      return;
    }

    const from = source.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    if (!to.width || !to.height) { reset(); return; }
    const eased = progress * progress * (3 - 2 * progress);
    const mix = (a: number, b: number) => a + (b - a) * eased;
    // Both endpoints are measured in their resting viewport positions.
    const fromY = from.top + travel - sectionTop;
    const toY = to.top - sectionTop;
    const width = mix(from.width, to.width);
    const height = mix(from.height, to.height);
    // A single isolated image changes crop; no page layout is animated.
    Object.assign(transfer.style, {
      width: `${width}px`, height: `${height}px`,
      transform: `translate3d(${mix(from.left, to.left)}px, ${mix(fromY, toY)}px, 0)`,
      borderRadius: `${mix(16, 12)}px`, visibility: "visible",
    });
    page.classList.add("is-photo-transferring");
  }

  function schedule() { if (!frame) frame = requestAnimationFrame(update); }
  onMounted(() => {
    preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", schedule);
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);
    root.value?.addEventListener("load", schedule, true);
    observer = new ResizeObserver(schedule);
    if (root.value) observer.observe(root.value);
    schedule();
  });
  onBeforeUnmount(() => {
    cancelAnimationFrame(frame);
    observer?.disconnect();
    preference?.removeEventListener("change", schedule);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    root.value?.removeEventListener("load", schedule, true);
    reset();
  });
}
