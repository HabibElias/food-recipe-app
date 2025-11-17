import { defineStore } from "pinia";

export const useBookmarksStore = defineStore("bookmarks", () => {
  const userStore = useUserStore();
  const toast = useToast();

  const bookmarks = ref<{ id: number; recipe: Recipe }[]>([]);
  const loading = ref(false);

  const isLoading = computed(() => loading.value);

  const GetBookmarks = gql`
    query GetUserBookmarks($user_id: uuid) {
      bookmark(where: { user_id: { _eq: $user_id } }) {
        id
        recipe {
          id
        title
        description
        category {
          id
          category_name
        }
        user {
          id
          username
          FirstName
          LastName
          avatar_url
        }
        recipe_images(where: { is_thumbnail: { _eq: true } }) {
          id
          img_url
          is_thumbnail
        }
        prep_time
        recipe_ingredients_aggregate {
          aggregate {
            count
          }
        }
        recipe_ratings_aggregate {
          aggregate {
            avg {
              rating
            }
          }
        }
        bookmarks(where: { user_id: { _eq: $user_id } }) {
          id
        }
        }
      }
    }
  `;

  const INSERT_BOOKMARK_MUTATION = gql`
    mutation InsertBookmarkMutation($user_id: uuid, $recipe_id: Int!) {
      insert_bookmark_one(object: { user_id: $user_id, recipe_id: $recipe_id }) {
        id
      }
    }
  `;

  const DeleteBookmarkMutation = gql`
    mutation DeleteBookmark($id: Int!) {
      delete_bookmark_by_pk(id: $id) {
        id
      }
    }
  `;

  async function loadBookmarks() {
    loading.value = true;
    try {
      const { data } = await useApolloClient().client.query({
        query: GetBookmarks,
        variables: { user_id: userStore.user?.id },
        fetchPolicy: "network-only",
      });
      bookmarks.value = data.bookmark ?? [];
    }
    catch (err: any) {
      console.error(err);
      toast.error({ title: "Error", message: err.message || "Failed to load bookmarks" });
    }
    finally {
      loading.value = false;
    }
  }

  async function addBookmark(recipe_id: number) {
    if (!userStore.isLoggedIn) {
      toast.info({ message: "Log In to Bookmark a recipe" });
      return;
    }
    try {
      const { data } = await useApolloClient().client.mutate({
        mutation: INSERT_BOOKMARK_MUTATION,
        variables: { user_id: userStore.user?.id, recipe_id },
      });
      toast.success({ message: "Bookmarked your recipe" });
      // refresh list
      await loadBookmarks();
      return data.insert_bookmark_one;
    }
    catch (err: any) {
      console.error(err);
      toast.error({ message: err.message || String(err) });
      throw err;
    }
  }

  async function removeBookmark(id: number) {
    if (!userStore.isLoggedIn) {
      toast.info({ message: "Log In to Bookmark a recipe" });
      return;
    }
    try {
      await useApolloClient().client.mutate({
        mutation: DeleteBookmarkMutation,
        variables: { id },
      });
      toast.success({ message: "Successfully deleted your bookmark" });
      await loadBookmarks();
    }
    catch (err: any) {
      console.error(err);
      toast.error({ message: err.message || String(err) });
      throw err;
    }
  }

  return { isLoading, bookmarks, loading, loadBookmarks, addBookmark, removeBookmark };
});
