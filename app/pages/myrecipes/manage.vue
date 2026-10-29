<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true });
useSeoMeta({ title: "Manage your recipes · Bowlup" });
</script>
<template><RecipeManager /></template>
