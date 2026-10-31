import type { Ref } from "vue";

export function useLandingContinuity(root: Ref<HTMLElement | null>) {
  let frame = 0;
  let colorFrame = 0;
  let colorTime = 0;
  let currentColor: number[] | undefined;
  let targetColor: number[] = [];
  let preference: MediaQueryList | undefined;
  const lightInk = useState<boolean>("landing-light-ink", () => false);
  const clamp = (n: number) => Math.max(0, Math.min(1, n));
  const channels = (hex: string) => hex.match(/[a-f\d]{2}/gi)!.map(value => parseInt(value, 16));
  const luminance = (rgb: number[]) => rgb.map(value => {
    const c = value / 255;
    return c <= .04045 ? c / 12.92 : ((c + .055) / 1.055) ** 2.4;
  }).reduce((sum, value, index) => sum + value * [ .2126, .7152, .0722 ][index]!, 0);

  function blendGround(app: HTMLElement, target: number[], roast: number[], cream: number[]) {
    targetColor = target;
    const paint = () => {
      const rgb = currentColor!.map(Math.round);
      const lightness = luminance(rgb);
      const lightContrast = (luminance(cream) + .05) / (lightness + .05);
      const darkContrast = (lightness + .05) / (luminance(roast) + .05);
      lightInk.value = lightContrast > darkContrast;
      app.dataset.flowInk = lightInk.value ? "light" : "dark";
      app.style.setProperty("--flow-ground", `rgb(${rgb.join(",")})`);
      app.style.setProperty("--flow-ink", lightInk.value ? "var(--cream)" : "var(--roast)");
    };
    if (!currentColor || preference?.matches) {
      cancelAnimationFrame(colorFrame);
      colorFrame = 0;
      currentColor = target;
      paint();
      return;
    }
    if (colorFrame) return;
    colorTime = performance.now();
    const settle = (now: number) => {
      // About four seconds to settle: quick scrolls never snap the color field.
      const amount = 1 - Math.exp(-Math.min(now - colorTime, 64) / 900);
      colorTime = now;
      currentColor = currentColor!.map((value, index) => value + (targetColor[index]! - value) * amount);
      const arrived = currentColor.every((value, index) => Math.abs(targetColor[index]! - value) < .25);
      if (arrived) currentColor = targetColor;
      paint();
      colorFrame = arrived ? 0 : requestAnimationFrame(settle);
    };
    colorFrame = requestAnimationFrame(settle);
  }

  function updateChapters(page: HTMLElement) {
    const app = page.closest<HTMLElement>(".bowlup-app");
    if (!app) return;
    const palette = getComputedStyle(page);
    const color = (name: string) => channels(palette.getPropertyValue(`--${name}`).trim().replace("#", ""));
    const roast = color("roast"), cream = color("cream");
    const chapters = [
      [".landing-kitchen", "cream"], [".landing-share", "saffron"],
      [".landing-starters", "cream"], [".landing-faq", "surface"],
      [".landing-closing", "ember"],
    ];
    const stops = [{ y: 0, rgb: roast }];
    const entries: [HTMLElement, number][] = [];
    let previous = roast;
    for (const [selector, token] of chapters) {
      const section = page.querySelector<HTMLElement>(selector!);
      if (!section) continue;
      const box = section.getBoundingClientRect();
      const top = box.top + window.scrollY;
      const padding = parseFloat(getComputedStyle(section).paddingTop);
      const start = Math.max(stops.at(-1)!.y + 1, top - window.innerHeight * .85);
      stops.push({ y: start, rgb: previous });
      previous = color(token!);
      stops.push({ y: Math.max(start + 1, top + Math.min(padding * .5, 80)), rgb: previous });
      const entry = preference?.matches ? 1 : clamp((window.innerHeight - box.top) / (window.innerHeight * .75));
      entries.push([section, entry]);
    }
    const end = page.getBoundingClientRect().bottom + window.scrollY;
    const start = Math.max(stops.at(-1)!.y + 1, end - window.innerHeight * .85);
    stops.push({ y: start, rgb: previous }, { y: Math.max(start + 1, end + 25), rgb: roast });
    const focus = window.scrollY + window.innerHeight * .5;
    let rgb = roast;
    for (let index = 1; index < stops.length; index++) {
      const from = stops[index - 1]!, to = stops[index]!;
      const progress = clamp((focus - from.y) / (to.y - from.y));
      const eased = progress * progress * (3 - 2 * progress);
      rgb = from.rgb.map((value, channel) => Math.round(value + (to.rgb[channel]! - value) * eased));
      if (focus < to.y) break;
    }
    entries.forEach(([section, entry]) => section.style.setProperty("--chapter-entry", String(entry)));
    blendGround(app, rgb, roast, cream);
  }
  function update() {
    frame = 0;
    const page = root.value;
    if (!page) return;
    updateChapters(page);
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
    cancelAnimationFrame(colorFrame);
    preference?.removeEventListener("change", schedule);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
    const app = root.value?.closest<HTMLElement>(".bowlup-app");
    if (app) delete app.dataset.flowInk;
    app?.style.removeProperty("--flow-ground");
    app?.style.removeProperty("--flow-ink");
  });
}
