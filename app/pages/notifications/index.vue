<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true });
useSeoMeta({ title: "Notifications · Bowlup" });
const store = useNotificationsStore();
onMounted(()=>store.loadInitial());
</script>
<template>
 <section class="profile-page"><header class="page-heading section-heading"><div><h1>From the kitchen.</h1><p>A little activity around the recipes you share.</p></div><button v-if="store.notifications.length" class="btn btn-outline" :disabled="store.loading" @click="store.clear">Mark all as read</button></header><p v-if="store.error" class="form-error" role="alert">{{ store.error }} <button class="text-link" @click="store.loadInitial">Try again</button></p><div v-if="store.loading" class="empty-state" role="status"><p>Checking for something new…</p></div><ul v-else-if="store.notifications.length" class="notification-list"><li v-for="note in store.notifications" :key="note.id"><Icon name="lucide:bell" size="20" /><div><p>{{ note.message }}</p><time :datetime="note.created_at">{{ new Date(note.created_at).toLocaleDateString(undefined,{month:'short',day:'numeric',year:'numeric'}) }}</time></div></li></ul><div v-else class="empty-state"><Icon name="lucide:bell" size="30" /><h2>All caught up.</h2><p>When there's something new around your recipes, you'll find it here.</p><button class="btn btn-outline mt-4" @click="store.loadInitial">Check again</button></div></section>
</template>
