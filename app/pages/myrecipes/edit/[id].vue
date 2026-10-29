<script setup lang="ts">
definePageMeta({middleware:["auth"],requiresAuth:true,key:route=>route.fullPath});
const route=useRoute();
useSeoMeta({title:"Edit your recipe — Bowlup"});
</script>
<template><RecipeEditor :recipe-id="Number(route.params.id)" /></template>
