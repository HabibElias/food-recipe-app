import type { Ref } from "vue";

export function useLandingMotion(root: Ref<HTMLElement | null>) {
  let observer: IntersectionObserver | undefined;
  let preference: MediaQueryList | undefined;
  const animations = new Set<Animation>();
  const seen = new WeakSet<Element>();
  const ease = "cubic-bezier(.16,1,.3,1)";

  function configure() {
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    animations.clear();
    if (preference?.matches || !root.value || !("IntersectionObserver" in window) || !("animate" in Element.prototype)) return;
    observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting || seen.has(entry.target)) return;
        const element = entry.target as HTMLElement;
        seen.add(element);
        observer?.unobserve(element);
        let frames: Keyframe[];
        switch (element.dataset.reveal) {
          case "photo":
            frames = [{ clipPath: "inset(0 18% 0 0 round 22px)", transform: "translateX(-18px) rotate(-4deg)" }, { clipPath: "inset(0 round 22px)", transform: "rotate(-2deg)" }];
            break;
          case "pass":
            frames = [{ clipPath: "inset(0 0 12% 0 round 16px)", transform: "translate(24px, 18px) rotate(6deg)" }, { clipPath: "inset(0 round 16px)", transform: "rotate(3deg)" }];
            break;
          case "arrival":
            frames = [{ transform: "translateY(32px) scale(.96)", clipPath: "inset(0 0 12% round 20px)" }, { transform: "none", clipPath: "inset(0 round 20px)" }];
            break;
          case "signature":
            frames = [{ clipPath: "inset(0 100% 0 0)" }, { clipPath: "inset(0)" }];
            break;
          case "recipe":
            frames = [{ transform: "translateY(24px) rotate(1deg)" }, { transform: "none" }];
            break;
          default:
            frames = [{ clipPath: "inset(0 0 55% 0)", transform: "translateY(12px)" }, { clipPath: "inset(0)", transform: "none" }];
        }
        const animation = element.animate(frames, { duration: element.dataset.reveal === "signature" ? 800 : 720, delay: Number(element.dataset.revealDelay || 0), easing: ease });
        animations.add(animation);
        animation.finished.then(() => animations.delete(animation)).catch(() => {});
      });
    }, { rootMargin: "0px 0px -5% 0px", threshold: .08 });
    root.value.querySelectorAll("[data-reveal]").forEach(element => { if (!seen.has(element)) observer?.observe(element); });
  }
  onMounted(() => {
    preference = window.matchMedia("(prefers-reduced-motion: reduce)");
    preference.addEventListener("change", configure);
    configure();
  });
  onBeforeUnmount(() => {
    observer?.disconnect();
    animations.forEach(animation => animation.cancel());
    preference?.removeEventListener("change", configure);
  });
}
