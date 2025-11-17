import ADD_COMMENT_MUTATION from "~~/server/_mutations/AddCommentMutation.gql";
import BUY_RECIPE_MUTATION from "~~/server/_mutations/BuyRecipeMutation.gql";
import LIKE_RECIPE_MUTATION from "~~/server/_mutations/LikeMutation.gql";
import UNLIKE_RECIPE_MUTATION from "~~/server/_mutations/UnLikeMutation.gql";
import GET_RECIPE_LOGGED_IN from "~~/server/_queries/GetRecipeLoggedIn.gql";
import GET_RECIPE_NOT_LOGGED_IN from "~~/server/_queries/GetRecipeNotLoggedIn.gql";

export default function useRecipe(id: string) {
  const toast = useToast();
  const loading = ref<boolean>(false);
  const checkingOut = ref<boolean>(false);
  const liking = ref<boolean>(false);
  const posting = ref<boolean>(false);
  const recipe = ref<Recipe>();

  const userStore = useUserStore();
  const likesCount = computed(() => recipe.value?.recipe_likes_aggregate?.aggregate?.count ?? 0);
  const userHasLiked = computed(() => (recipe.value?.recipe_likes?.length ?? 0) > 0);

  const GET_RECIPE_QUERY = computed(() => userStore.isLoggedIn ? GET_RECIPE_LOGGED_IN : GET_RECIPE_NOT_LOGGED_IN);

  const selectedRating = ref<number>(0);
  const ratingMessage = ref("");
  function onRatingChange(value: number) {
    selectedRating.value = value;
    ratingMessage.value = "";
  }

  async function submitRating() {
    if (!userStore.user) {
      return navigateTo("/auth/login");
    }

    if (!selectedRating.value || selectedRating.value <= 0) {
      ratingMessage.value = "Please select how many stars to rate before submitting";
      return;
    }

    try {
      const INSERT_RATING_MUTATION = gql`
    mutation InsertRatingMutation($recipe_id: Int!, $user_id: uuid, $rating: Int!) {
      insert_recipe_rating(objects: {recipe_id: $recipe_id, user_id: $user_id, rating: $rating}) {
        returning {
          id
        }
      }
    }
    `;

      await useApolloClient().client.mutate({
        mutation: INSERT_RATING_MUTATION,
        variables: { recipe_id: recipe.value?.id, user_id: userStore.user.id, rating: Number(selectedRating.value) },
      });

      if (recipe.value) {
        const newRating = {
          user: {
            avatar_url: userStore.user.avatar_url,
            username: userStore.user.username,
            FirstName: userStore.user.FirstName,
          },
          rating: selectedRating.value,
        };
        const newRecipe = {
          ...recipe.value,
          recipe_ratings: [...(recipe.value.recipe_ratings ?? []), newRating],
        };
        // replace the whole recipe.value to avoid mutating read-only nested props
        recipe.value = newRecipe;
      }
      ratingMessage.value = "Thanks for your rating!";
    }
    catch (err) {
      console.error(err);
      ratingMessage.value = "Failed to submit rating.";
    }
  }

  async function loadRecipe() {
    loading.value = true;
    try {
      const { data } = await useApolloClient().client.query<{
        recipe: NonNullable<typeof recipe.value>[];
      }>({
        query: GET_RECIPE_QUERY.value,
        variables: userStore.isLoggedIn
          ? {
              id: Number(id),
              user_id: userStore.user?.id,
            }
          : {
              id: Number(id),
            },
      });

      recipe.value = data.recipe[0];
    }
    catch (err: any) {
      console.error(err);
      toast.error({ title: "Error", message: err.message || "Failed to load recipe" });
    }
    finally {
      loading.value = false;
    }
  }

  async function buyRecipe() {
    if (!userStore.user) {
      toast.info({ title: "Login required", message: "Please login to like recipes." });
      return;
    }
    checkingOut.value = true;
    try {
      const { data } = await useApolloClient().client.mutate({
        mutation: BUY_RECIPE_MUTATION,
        variables: { recipe_id: recipe.value?.id, amount: recipe.value?.price },
      });
      const checkoutUrl = data.initializePayment.checkout_url;
      window.location.href = checkoutUrl;
    }
    catch (error) {
      toast.error({ title: "Checkout", message: "Checkout is not available try again later." });
      console.error("Payment error:", error);
    }
    finally {
      checkingOut.value = false;
    }
  }

  async function toggleLike() {
    if (!userStore.user) {
      toast.info({ title: "Login required", message: "Please login to like recipes." });
      return;
    }
    if (!recipe.value?.id) {
      return;
    }
    liking.value = true;
    try {
      const prevUserLiked = userHasLiked.value;
      const prevCount = likesCount.value;
      const rid = recipe.value?.id;

      if (!rid) {
      // nothing to do if recipe id is missing
      }
      else if (prevUserLiked) {
      // user had liked -> remove like optimistically
        const newRecipe = {
          ...recipe.value!,
          recipe_likes: [],
          recipe_likes_aggregate: { aggregate: { count: Math.max(0, prevCount - 1) } },
        };
        recipe.value = newRecipe;
        await useApolloClient().client.mutate({
          mutation: UNLIKE_RECIPE_MUTATION,
          variables: { recipe_id: rid, user_id: userStore.user?.id },
        });
      }
      else {
      // user hasn't liked -> add temporary like optimistically
        const newRecipe = {
          ...recipe.value!,
          recipe_likes: [{ id: "temp" }],
          recipe_likes_aggregate: { aggregate: { count: prevCount + 1 } },
        };
        recipe.value = newRecipe;
        await useApolloClient().client.mutate({
          mutation: LIKE_RECIPE_MUTATION,
          variables: { recipe_id: rid, user_id: userStore.user?.id },
        });
      }
    }
    catch (err: any) {
      console.error(err);
      toast.error({ title: "Error", message: err.message || "Failed to update like" });
      await loadRecipe();
    }
    finally {
      liking.value = false;
    }
  }

  const newComment = ref<string>("");
  async function addComment() {
    if (!userStore.user) {
      toast.info({ title: "Login required", message: "Please login to comment." });
      return;
    }
    const content = newComment.value.trim();
    if (!content || !recipe.value?.id) {
      return;
    }
    posting.value = true;
    try {
      const result = await useApolloClient().client.mutate({
        mutation: ADD_COMMENT_MUTATION,
        variables: { recipe_id: recipe.value.id, commentBody: content, user_id: userStore.user.id },
      });
      // mutation returns { insert_recipe_comment: { returning: [comment] } }
      const added = result?.data?.insert_recipe_comment?.returning?.[0];
      if (added) {
        const newRecipe = {
          ...recipe.value!,
          recipe_comments: [added, ...(recipe.value.recipe_comments ?? [])],
        };
        // replace the whole recipe.value to avoid mutating read-only nested props
        recipe.value = newRecipe;
        newComment.value = "";
      }
      else {
        toast.error({ title: "Error", message: "Failed to add comment" });
      }
    }
    catch (err: any) {
      console.error(err);
      toast.error({ title: "Error", message: err.message || "Failed to add comment" });
    }
    finally {
      posting.value = false;
    }
  }
  return {
    selectedRating,
    onRatingChange,
    submitRating,
    ratingMessage,
    recipe,
    loading,
    loadRecipe,
    likesCount,
    userHasLiked,
    addComment,
    liking,
    posting,
    toggleLike,
    buyRecipe,
    checkingOut,
    newComment,
  };
}
