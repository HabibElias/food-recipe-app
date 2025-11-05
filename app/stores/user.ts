import LOGIN_MUTATION from "~~/server/_mutations/LoginMutation.gql";
import SIGNUP_MUTATION from "~~/server/_mutations/SignUpMutation.gql";
import GET_ME_QUERY from "~~/server/_queries/GetMe.gql";
import { defineStore } from "pinia";

export const useUserStore = defineStore("user", {
  state: () => ({
    user: null as User | null,
    token: null as string | null,
  }),

  getters: {
    isLoggedIn: state => !!state.token,
  },

  actions: {
    async init() {
      const token = useCookie("apollo-token");

      if (token.value) {
        try {
          this.token = token.value;

          const client = useApolloClient().client;

          const { data } = await client.query<{ user: User }>({ query: GET_ME_QUERY });

          this.user = data.user;
        }
        catch {
          token.value = "";
          this.token = null;
          this.user = null;
        }
      }
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

        await onLogin(token);
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

        await onLogin(token);
        navigateTo("/");
      }
      catch (err: any) {
        throw new Error(err.message);
      }
    },

    async logout() {
      const { onLogout } = useApollo();
      const cookie = useCookie("apollo-token", { path: "/", sameSite: "lax" });
      onLogout("default");
      cookie.value = "";
      this.user = null;
      navigateTo("/auth/login");
    },
  },
});
