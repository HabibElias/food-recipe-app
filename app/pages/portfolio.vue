<script setup lang="ts">
import downloads from "~/data/portfolio-downloads.json";

const base = "/downloads/bowlup";
const layouts = [
  { file: "01-opening.png", title: "The opening", description: "A food-first introduction and working recipe search." },
  { file: "02-journey.png", title: "Find, save, cook", description: "Three moments from the interactive recipe preview." },
  { file: "03-responsive.png", title: "Across screens", description: "Desktop and phone compositions, side by side." },
  { file: "04-product.png", title: "From search to supper", description: "The public recipe catalog and a real recipe detail." },
];

useSeoMeta({ title: "Portfolio downloads — Bowlup", robots: "noindex, follow" });
</script>

<template>
  <section class="portfolio-downloads">
    <header class="portfolio-intro">
      <h1>Bowlup for your portfolio.</h1>
      <p>High-resolution screenshots and case-study layouts, ready to download. The complete pack includes 16 desktop, tablet, and phone screenshots, four presentation images, a PDF, captions, and photography credits.</p>
      <div class="portfolio-actions">
        <a :href="`${base}/Bowlup-portfolio-pack.zip`" download="Bowlup-portfolio-pack.zip" class="btn btn-primary">Download the complete pack <Icon name="lucide:download" size="18" /></a>
        <a :href="`${base}/Bowlup-case-study.pdf`" target="_blank" rel="noopener" class="text-link">Open the case-study PDF <Icon name="lucide:arrow-up-right" size="18" /></a>
      </div>
      <p class="portfolio-file-sizes">ZIP · {{ downloads.archiveSize }} <span aria-hidden="true">/</span> PDF · {{ downloads.pdfSize }}</p>
    </header>

    <section aria-labelledby="portfolio-layouts-title">
      <h2 id="portfolio-layouts-title">Your case study, laid out.</h2>
      <p>Download each layout separately as a 3200 × 2400 PNG.</p>
      <div class="portfolio-layouts">
        <figure v-for="layout in layouts" :key="layout.file">
          <a :href="`${base}/presentation/${layout.file}`" :download="`Bowlup-${layout.file}`" :aria-label="`Download ${layout.title} as a PNG`"><img :src="`${base}/presentation/${layout.file}`" :alt="layout.description" width="3200" height="2400" loading="lazy"></a>
          <figcaption><div><h3>{{ layout.title }}</h3><p>{{ layout.description }}</p></div><a :href="`${base}/presentation/${layout.file}`" :download="`Bowlup-${layout.file}`" class="text-link" :aria-label="`Download ${layout.title} PNG`">PNG <Icon name="lucide:download" size="18" /></a></figcaption>
        </figure>
      </div>
    </section>

    <section class="portfolio-originals" aria-labelledby="portfolio-originals-title">
      <h2 id="portfolio-originals-title">Prefer the original screenshots?</h2>
      <p>Choose an unframed capture for your own layout. Desktop and tablet images are captured at 2× resolution; phone images at 3×.</p>
      <details>
        <summary>Choose from all 16 screenshots</summary>
        <ul>
          <li v-for="shot in downloads.screenshots" :key="shot.file"><a :href="`${base}/screenshots/${shot.file}`" :download="`Bowlup-${shot.file}`"><span>{{ shot.title }}<small>{{ shot.viewport.width * shot.scale }} × {{ shot.viewport.height * shot.scale }} · PNG</small></span><Icon name="lucide:download" size="18" /></a></li>
        </ul>
      </details>
      <p class="portfolio-credits"><a :href="`${base}/CREDITS.md`" download="Bowlup-photo-credits.md">Download photography credits</a> or <NuxtLink to="/photo-credits">view them on Bowlup</NuxtLink>. Suggested captions are included in the complete pack.</p>
    </section>
  </section>
</template>

<style scoped>
.portfolio-downloads { padding-bottom:80px; }
.portfolio-intro { max-width:900px; padding-block:48px 88px; }
.portfolio-intro h1 { font-size:clamp(36px,4.8vw,64px); font-weight:600; margin:0 0 28px; }
.portfolio-intro>p { max-width:66ch; font-size:18px; }
.portfolio-actions { display:flex; align-items:center; flex-wrap:wrap; gap:24px 32px; margin-top:32px; }
.portfolio-intro .portfolio-file-sizes { font-size:14px; margin:20px 0 0; }
.portfolio-file-sizes span { padding-inline:14px; }
.portfolio-downloads h2 { font-size:clamp(28px,3vw,38px); font-weight:550; margin:0 0 16px; }
.portfolio-downloads h2+p { max-width:66ch; margin-bottom:36px; }
.portfolio-layouts { display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:56px 36px; }
.portfolio-layouts figure { margin:0; min-width:0; }
.portfolio-layouts figure>a { display:block; }
.portfolio-layouts img { width:100%; height:auto; display:block; aspect-ratio:4/3; }
.portfolio-layouts figcaption { display:flex; align-items:start; justify-content:space-between; gap:24px; padding-top:20px; }
.portfolio-layouts h3 { font-size:24px; font-weight:550; margin:0 0 8px; }
.portfolio-layouts p { margin:0; }
.portfolio-layouts figcaption>a { min-height:44px; }
.portfolio-originals { margin-top:104px; }
.portfolio-originals summary { cursor:pointer; font-size:18px; font-weight:600; padding-block:16px; }
.portfolio-originals ul { list-style:none; margin:24px 0 0; padding:0; display:grid; grid-template-columns:repeat(2,minmax(0,1fr)); gap:8px 48px; }
.portfolio-originals li a { display:flex; align-items:center; justify-content:space-between; gap:24px; padding:18px 12px; border-radius:12px; }
.portfolio-originals li a:hover { background:var(--surface); }
.portfolio-originals small { display:block; font-size:14px; margin-top:4px; }
.portfolio-credits { margin-top:40px; max-width:66ch; }
.portfolio-credits a { text-decoration:underline; }
@media(max-width:760px) {
  .portfolio-intro { padding-block:32px 64px; }
  .portfolio-intro>p { font-size:16px; }
  .portfolio-actions { align-items:start; flex-direction:column; gap:24px; }
  .portfolio-layouts,.portfolio-originals ul { grid-template-columns:1fr; }
  .portfolio-layouts { gap:40px; }
  .portfolio-layouts h3 { font-size:23px; }
  .portfolio-originals { margin-top:72px; }
  .portfolio-layouts figcaption { gap:16px; }
}
</style>
