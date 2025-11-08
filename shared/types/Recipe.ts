import type { Ingredient } from "./Ingredient";
import type { Step } from "./Step";

export type Recipe = {
  title: string;
  description: string;
  steps: Step[] | undefined;
  ingredients: Ingredient[] | undefined;
  is_paid: boolean;
  price: boolean;
};
