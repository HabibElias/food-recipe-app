import LOGIN_MUTATION from "~~/server/_mutations/LoginMutation.gql";
import SIGNUP_MUTATION from "~~/server/_mutations/SignUpMutation.gql";
import GET_ME_QUERY from "~~/server/_queries/GetMe.gql";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
    loading: false as boolean,
    initialized: false as boolean,
  }),

  getters: {
    isLoggedIn: state => !!state.token,
    isLoading: state => state.loading,
    isInitialized: state => state.initialized,
  },

  actions: {
    async init() {
      // Avoid running init multiple times
      if (this.initialized) {
        return;
      }

      const token = useCookie("apollo-token");
      this.loading = true;

      if (token.value) {
        try {
          const client = useApolloClient().client;
          const { onLogin } = useApollo();

          const { data } = await client.mutate<{ Me: { user: User; token: string } }>({ mutation: GET_ME_QUERY, variables: { token: token.value } });

          this.user = data?.Me.user || null;

          if (import.meta.client) {
            await onLogin(data?.Me.token ?? token.value);
          }
          this.token = token.value;
        }
        catch {
          token.value = "";
          this.token = null;
          this.user = null;
        }
      }

      this.loading = false;
      this.initialized = true;
    },

    async login(email: string, password: string) {
      const { onLogin } = useApollo();

      try {
        const client = useApolloClient().client;
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
