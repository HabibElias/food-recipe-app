<script setup lang="ts">
definePageMeta({ middleware: ["auth"], requiresAuth: true, layout: "custom" });

const notificationsStore = useNotificationsStore();
</script>

<template>
  <div class="mx-auto border border-base-content/50 rounded-4xl p-8 min-h-[70vh]">
    <div class="flex items-center justify-between mb-4">
      <h1 class="font-header-3">
        Notifications
      </h1>
      <button
        class="btn btn-ghost btn-sm"
        @click="notificationsStore.clear()"
      >
        Clear
      </button>
    </div>

    <div
      v-if="notificationsStore.isLoading.value"
      class="text-sm text-base-content/60"
    >
      Loading...
    </div>

    <ul v-else-if="notificationsStore.notifications.length > 0">
      <li
        v-for="note in notificationsStore.notifications"
        :key="note.id"
        class="p-4 border-b last:border-b-0 flex justify-between items-start"
      >
        <div>
          <div class="font-semibold">
            {{ note.message }}
          </div>
          <div class="text-xs text-base-content/50 mt-2">
            {{ new Date(note.created_at).toLocaleString() }}
          </div>
        </div>
      </li>
    </ul>
    <div
      v-else
      class="flex flex-col items-center justify-center py-12 text-center text-base-content/60"
    >
      <icon name="lucide:bell-dot" size="24" />

      <h2 class="mt-4 font-semibold">
        No notifications
      </h2>
      <p class="mt-2 text-sm">
        You're all caught up — there are no notifications right now.
      </p>
      <button
        class="btn btn-sm btn-ghost mt-4"
        aria-label="Refresh notifications"
        @click="notificationsStore.loadInitial()"
      >
        Refresh
      </button>
    </div>
  </div>
</template>
