import type { Ref } from "vue";

/** Visible without JS; a food card gets one short arrival when it enters view. */
export function useFoodReveal(target: Ref<HTMLElement | null>, delay: number) {
  let observer: IntersectionObserver | undefined;
  let animation: Animation | undefined;
  let preference: MediaQueryList | undefined;
  function cancel() { animation?.cancel(); }

  onMounted(() => {
    preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (preference.matches || !target.value || !("IntersectionObserver" in window)) return;
    preference.addEventListener("change", cancel);
    observer = new IntersectionObserver((entries) => {
      if (!entries.some(entry => entry.isIntersecting) || !target.value) return;
      observer?.disconnect();
      if (preference?.matches) return;
      animation = target.value.animate([
        { opacity: 0.6, transform: "translateY(16px) scale(.985)" },
        { opacity: 1, transform: "translateY(0) scale(1)" },
      ], { duration: 420, delay: Math.min(delay, 90), easing: "cubic-bezier(.16,1,.3,1)", fill: "backwards" });
    }, { threshold: 0.08, rootMargin: "0px 0px -24px 0px" });
    observer.observe(target.value);
  });

  onBeforeUnmount(() => {
    observer?.disconnect();
    preference?.removeEventListener("change", cancel);
    cancel();
  });
}
