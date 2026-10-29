<script setup lang="ts">
defineProps<{ categoryName:string }>();
</script>
<template><RecipeCatalog :category-name="categoryName" /></template>
