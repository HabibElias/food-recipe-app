<script setup lang="ts">
definePageMeta({middleware:["auth"],requiresAuth:true});
useSeoMeta({title:"Share a recipe — Bowlup"});
</script>
<template><RecipeEditor /></template>
