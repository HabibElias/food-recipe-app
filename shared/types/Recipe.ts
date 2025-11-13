export type Recipe = {
  id: number;
  title: string;
  description: string;
  is_paid: boolean;
  prep_time: number;
  user_id: string;
  price: number;
  category: {
    id: number;
    category_name: string;
  };
  user: {
    username: string;
    FirstName: string;
    LastName: string;
    bio: string;
    avatar_url: string;
  };
  recipe_ratings_aggregate: {
    aggregate: {
      avg: {
        rating: number;
      };
    };
  };
  recipe_ratings: {
    user: {
      username: string;
      FirstName: string;
      avatar_url: string;
    };
    rating: number;
  }[];
  recipe_steps: {
    id: string;
    step_no: number;
    step_description: string;
  }[];
  recipe_ingredients: {
    id: number;
    ingredient: string;
  }[];
  recipe_ingredients_aggregate: {
    aggregate: {
      count: number;
    };
  };
  recipe_images: {
    id: number;
    img_url: string;
    is_thumbnail: boolean;
  }[];
  payments: {
    id: string;
  }[];
  recipe_likes_aggregate?: { aggregate: { count: number } };
  recipe_likes?: { id: string }[];
  recipe_comments?: {
    id: string;
    comment_body: string;
    created_at: string;
    user?: { username?: string; avatar_url?: string; FirstName: string };
  }[];
};
