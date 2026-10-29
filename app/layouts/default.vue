<script setup lang="ts">
await useUserStore().init();
</script>
<template><div class="bowlup-app"><a href="#main-content" class="skip-link">Skip to content</a><AppHeader /><main id="main-content" class="site-content site-frame"><slot /></main><AppFooter /></div></template>
