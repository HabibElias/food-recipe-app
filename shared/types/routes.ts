export type RouteTuple = [string, string, Array<[string, string]>];

const recipeChildren: Array<[string, string]> = [
  ["Breakfast", "/recipes/breakfast"],
  ["Lunch", "/recipes/lunch"],
  ["Dinner", "/recipes/dinner"],
  ["Dessert", "/recipes/dessert"],
  ["Snacks", "/recipes/snacks"],
];

export const commonRoutes: RouteTuple[] = [
  ["Home", "/", []],
  ["Recipes", "/recipes", recipeChildren],
  ["About us", "/about-us", []],
];

export const loggedRoutes: RouteTuple[] = [
  ["My Recipes", "/myrecipes", []],
  ["Recipes", "/recipes", recipeChildren],
  ["Notification", "/notifications", []],
  ["About us", "/about-us", []],
];
