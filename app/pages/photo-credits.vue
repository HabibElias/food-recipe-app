<script setup lang="ts">
import photos from "../../public/images/recipes/credits.json";
useSeoMeta({title:"Food photography — Bowlup"});
</script>
<template><section style="padding-bottom:64px"><header class="page-heading"><h1>The food behind the photos.</h1><p>Real cooking, photographed by people who love it. These photographs illustrate the dishes in our sample kitchen; your results will be your own.</p></header><div class="photo-credit-list"><article v-for="photo in photos" :key="photo.ref" class="photo-credit"><img :src="'/' + photo.file.replace('public/','')" :alt="photo.title" loading="lazy" width="120" height="100"><div><h2>{{ photo.title }}</h2><p>By {{ photo.creator }} · {{ photo.license }}</p><p><a :href="photo.page" target="_blank" rel="noopener noreferrer">Original photograph</a> · <a :href="photo.licenseUrl" target="_blank" rel="noopener noreferrer">License</a></p><p>Resized for the web; cropped to fit the layout.</p></div></article></div></section></template>
