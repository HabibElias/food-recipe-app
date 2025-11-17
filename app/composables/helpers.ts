export function hasBookmark(rec: any) {
  return !!(rec && rec.bookmarks && rec.bookmarks.length > 0);
}

export function getBookmarkId(rec: any) {
  return rec && rec.bookmarks && rec.bookmarks[0] ? rec.bookmarks[0].id : undefined;
}
