<script setup lang="ts">
definePageMeta({middleware:[()=>useUserStore().isLoggedIn ? "/" : true]});
</script>
<template><AuthForm signup /></template>
