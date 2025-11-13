<script setup lang="ts">
const userStore = useUserStore();

userStore.logout();
</script>

<template>
  <NuxtLayout name="custom">
    <div class="min-h-[80vh] flex flex-col items-center justify-center border border-base-content/50 rounded-4xl">
      <span class="loading loading-dots loading-md" />
      Logging Out
    </div>
  </NuxtLayout>
</template>
