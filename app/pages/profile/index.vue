<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true });
useSeoMeta({ title: "Your profile · Bowlup" });
const store = useUserStore();
const user = computed(() => store.user);
</script>
<template>
 <section class="profile-page">
  <header class="page-heading"><h1>A place at the table.</h1><p>Your profile and everything you bring to the kitchen.</p></header>
  <div class="profile-intro"><img v-if="user?.avatar_url" :src="user.avatar_url" class="profile-avatar" alt="Your profile photo"><span v-else class="profile-avatar" aria-hidden="true">{{ (user?.FirstName || user?.username || 'Y').slice(0,1).toUpperCase() }}</span><div><h2>{{ user?.FirstName }} {{ user?.LastName }}</h2><p>@{{ user?.username }}</p><p>{{ user?.bio || "Tell other cooks a little about yourself." }}</p><NuxtLink to="/profile/edit" class="btn btn-outline mt-4">Edit your profile<Icon name="lucide:pencil" size="16" /></NuxtLink></div></div>
  <div class="profile-links"><NuxtLink to="/myrecipes"><Icon name="lucide:notebook-pen" size="23" /><span class="profile-link-copy"><strong>Your recipes</strong><small>Create, edit and manage what you share.</small></span><Icon name="lucide:arrow-right" size="20" /></NuxtLink><NuxtLink to="/bookmarks"><Icon name="lucide:bookmark" size="23" /><span class="profile-link-copy"><strong>Saved for later</strong><small>Your next good meal is waiting.</small></span><Icon name="lucide:arrow-right" size="20" /></NuxtLink></div>
 </section>
</template>
