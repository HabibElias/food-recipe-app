import LOGIN_MUTATION from "~~/server/_mutations/LoginMutation.gql";
import SIGNUP_MUTATION from "~~/server/_mutations/SignUpMutation.gql";
import GET_ME_QUERY from "~~/server/_queries/GetMe.gql";
import { defineStore } from "pinia";
import { invalidAuthSession, waitForAuthBackend } from "~~/shared/utils/auth";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false as boolean,
    initialized: false as boolean,
    authConnecting: false,
  }),

  getters: {
    isLoggedIn: state => !!state.token,
    isLoading: state => state.loading,
    isInitialized: state => state.initialized,
  },

  actions: {
    async init() {
      // Avoid running init multiple times
      if (this.initialized || this.loading) {
        return;
      }

      const token = useCookie("apollo-token");
      this.loading = true;

      if (token.value) {
        this.token = token.value;
        try {
          const client = useApolloClient().client;
          const { onLogin } = useApollo();

          await this.waitForBackend();

          const { data } = await client.mutate<{ Me: { user: User; token: string } }>({ mutation: GET_ME_QUERY, variables: { token: token.value } });

          if (!data?.Me) throw new Error("Authentication response unavailable");
          this.user = data.Me.user;
          this.token = data.Me.token;
          token.value = data.Me.token;

          if (import.meta.client) {
            await onLogin(data.Me.token, "default", true);
          }
        }
        catch (error) {
          if (invalidAuthSession(error)) {
            token.value = "";
            this.token = null;
            this.user = null;
          }
          else {
            // A sleeping service or network outage does not invalidate the cookie.
            this.loading = false;
            return;
          }
        }
      }

      this.loading = false;
      this.initialized = true;
    },

    async waitForBackend() {
      this.authConnecting = true;
      try {
        await waitForAuthBackend(() => $fetch("/api/auth/ready", { timeout: 8000, retry: 0 }), {
          // SSR stays bounded; hydration can finish restoring a sleeping session.
          timeoutMs: import.meta.server ? 0 : 90_000,
        });
      }
      finally { this.authConnecting = false; }
    },

    async login(email: string, password: string) {
      const { onLogin } = useApollo();

      try {
        const client = useApolloClient().client;
        await this.waitForBackend();
        const { data } = await client.mutate<{ login: { token: string; loggedInUser: User } }>({
          mutation: LOGIN_MUTATION,
          variables: { email, password },
        });

        if (!data?.login)
          throw new Error("Invalid response from server");

        const { token, loggedInUser: user } = data.login;
        this.token = token;
        this.user = user;

        if (import.meta.client) {
          await onLogin(token);
        }
        navigateTo("/");
      }
      catch (err: any) {
        throw new Error(err.message);
      }
    },

    async signup(values: { first_name: string; last_name: string; email: string; password: string; username: string }) {
      const { onLogin } = useApollo();

      try {
        const client = useApolloClient().client;
        await this.waitForBackend();
        const { data } = await client.mutate<{ signup: { token: string; createdUser: User } }>({
          mutation: SIGNUP_MUTATION,
          variables: values,
        });

        if (!data?.signup)
          throw new Error("Invalid response from server");

        const { token, createdUser: user } = data.signup;
        this.token = token;
        this.user = user;

        if (import.meta.client) {
          await onLogin(token);
        }
        navigateTo("/");
      }
      catch (err: any) {
        throw new Error(err.message);
      }
    },

    async logout() {
      const { onLogout } = useApollo();
      const cookie = useCookie("apollo-token", { path: "/", sameSite: "lax" });
      if (import.meta.client) {
        onLogout("default");
      }
      cookie.value = "";
      this.user = null;
      this.token = null;
      navigateTo("/auth/login");
    },
  },
});
