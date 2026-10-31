<script setup lang="ts">
defineProps<{ withSubscribe?: boolean }>();
const route = useRoute();
const lightInk = useState<boolean>("landing-light-ink", () => false);
</script>
<template>
 <footer class="site-footer"><div class="site-frame">
  <div class="footer-top"><div><NuxtLink to="/" aria-label="Bowlup home"><img class="footer-logo" :src="route.path === '/' && !lightInk ? '/brand/bowlup-logo-horizontal-orange.svg' : '/brand/bowlup-logo-horizontal-cream.svg'" alt="Bowlup" width="142" height="47"></NuxtLink><p>Good food. A little inspiration.<br>Something worth making tonight.</p></div>
   <nav class="footer-nav" aria-label="Footer"><NuxtLink to="/browse">Find a recipe</NuxtLink><NuxtLink to="/bookmarks">Saved recipes</NuxtLink><NuxtLink to="/recipes/add">Share your cooking</NuxtLink><NuxtLink to="/cooking-tips">In the kitchen</NuxtLink><NuxtLink to="/about-us">About Bowlup</NuxtLink><NuxtLink to="/auth/sign-up">Join Bowlup</NuxtLink></nav>
  </div>
  <div class="footer-bottom"><span>© {{ new Date().getFullYear() }} Bowlup. Cook something good tonight.</span><NuxtLink to="/photo-credits">Food photography &amp; credits</NuxtLink></div>
 </div></footer>
</template>
