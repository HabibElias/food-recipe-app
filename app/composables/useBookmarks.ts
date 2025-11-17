import { useBookmarksStore } from "~/stores/bookmarks";

export default function useBookmarks() {
  const store = useBookmarksStore();

  // expose compatibility API expected by existing components
  return {
    bookmarked: store.bookmarks,
    loadingRecipes: store.loading,
    loadRecipes: store.loadBookmarks,
    deleteBookmark: store.removeBookmark,
    bookmarkRecipe: store.addBookmark,
    // also expose store in case caller wants direct access
    store,
  };
}
