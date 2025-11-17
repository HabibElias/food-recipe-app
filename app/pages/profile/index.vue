<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true, layout: "custom" });

const userStore = useUserStore();
const user = computed(() => userStore.user);
</script>

<template>
  <div class="border-base-content/50 border rounded-4xl p-8 min-h-[60vh]">
    <div class="space-y-6">
      <div class="flex flex-col md:flex-row items-center gap-6">
        <div>
          <div v-if="userStore.user?.avatar_url" tabindex="0" class="avatar cursor-pointer">
            <div class="w-24 rounded">
              <img src="https://img.daisyui.com/images/profile/demo/batperson@192.webp">
            </div>
          </div>
          <div v-else tabindex="0" class="avatar avatar-placeholder h-fit cursor-pointer">
            <div class="bg-neutral text-neutral-content w-24 rounded-full">
              <span class="text-xl">{{ userStore.user?.FirstName.slice(0, 1).toUpperCase() }}</span>
            </div>
          </div>
        </div>
        <div>
          <div class="font-header-2">
            {{ user?.FirstName || user?.username }}
          </div>
          <div class="text-sm text-base-content/70">
            {{ user?.email }}
          </div>
          <div class="mt-2 text-sm text-base-content/60">
            {{ user?.bio || 'No bio yet.' }}
          </div>
          <div class="ml-auto mt-4">
            <NuxtLink to="/profile/edit" class="btn">
              Edit profile
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
