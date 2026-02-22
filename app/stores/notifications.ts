import { defineStore } from "pinia";
import { ref, watch } from "vue";

export const useNotificationsStore = defineStore("notifications", () => {
  const userStore = useUserStore();
  const notifications = ref<Array<any>>([]);
  const loading = ref(false);

  const isLoading = computed(() => loading);

  function setNotifications(data: any[]) {
    notifications.value = data ?? [];
  }

  async function loadInitial() {
    if (!import.meta.client || !userStore.user?.id)
      return;

    loading.value = true;
    try {
      const client = useApolloClient().client;
      const { data } = await client.query({
        query: gql`query GetUserNotifications($user_id: uuid) { notifications(where: { user_id: { _eq: $user_id }, read: { _eq: false } }, order_by: { created_at: desc }) { id message read created_at } }`,
        variables: { user_id: userStore.user.id },
        fetchPolicy: "network-only",
      });

      // server returns `notifications` field
      setNotifications(data?.notifications ?? []);
    }
    catch (err) {
      console.error("Failed to load notifications", err);
    }
    finally {
      loading.value = false;
    }
  }

  async function clear() {
    if (!import.meta.client || !userStore.user?.id) {
      notifications.value = notifications.value.map((n: any) => ({ ...n, read: true }));
      return;
    }

    loading.value = true;
    try {
      const client = useApolloClient().client;
      const { data } = await client.mutate({
        mutation: gql`mutation MarkAllNotificationsRead($user_id: uuid) { update_notifications(where: { user_id: { _eq: $user_id }, read: { _eq: false } }, _set: { read: true }) { affected_rows returning { id read } } }`,
        variables: { user_id: userStore.user.id },
      });

      notifications.value = [];
      useToast()?.success?.({ message: "Marked all notifications read." });
      return data?.update_notifications ?? null;
    }
    catch (err: any) {
      console.error("Failed to mark notifications read", err);
      useToast()?.error?.({ message: err?.message || String(err) });
      notifications.value = notifications.value.map((n: any) => ({ ...n, read: true }));
    }
    finally {
      loading.value = false;
    }
  }

  // Load notifications when user becomes available (client-only)
  watch(() => userStore.user, (u) => {
    if (u) {
      loadInitial();
    }
    else {
      notifications.value = [];
    }
  }, { immediate: true });

  return { isLoading, notifications, loading, loadInitial, clear };
});
