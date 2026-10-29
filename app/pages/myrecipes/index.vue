<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true });
useSeoMeta({ title: "Your recipes · Bowlup" });
</script>
<template><RecipeManager /></template>
