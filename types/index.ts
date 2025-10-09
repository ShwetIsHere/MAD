// User Types
export interface UserProfile {
  id: string;
  email: string;
  username?: string;
  full_name?: string;
  avatar_url?: string;
  dietary_preferences: DietaryPreferences;
  created_at: string;
  updated_at: string;
}

export interface DietaryPreferences {
  diet_type: 'veg' | 'vegan' | 'non-veg' | 'pescatarian' | 'any';
  allergies: string[];
  dislikes: string[];
  preferred_cuisines: string[];
}

// Grocery Types
export interface GroceryItem {
  id: string;
  user_id: string;
  name: string;
  category: string;
  quantity: number;
  unit: string;
  expiry_date?: string;
  barcode?: string;
  created_at: string;
  updated_at: string;
}

export type GroceryCategory =
  | 'vegetables'
  | 'fruits'
  | 'grains'
  | 'dairy'
  | 'meat'
  | 'seafood'
  | 'spices'
  | 'condiments'
  | 'beverages'
  | 'other';

// Recipe Types
export interface Recipe {
  id: string;
  title: string;
  description: string;
  image_url?: string;
  cuisine_type: string;
  cooking_time: number; // in minutes
  difficulty: 'easy' | 'medium' | 'hard';
  servings: number;
  ingredients: RecipeIngredient[];
  instructions: RecipeInstruction[];
  nutrition_info?: NutritionInfo;
  tags: string[];
  created_by?: string;
  is_local?: boolean;
  location?: string;
  created_at: string;
  updated_at: string;
}

export interface RecipeIngredient {
  name: string;
  quantity: number;
  unit: string;
  optional?: boolean;
}

export interface RecipeInstruction {
  step: number;
  description: string;
  image_url?: string;
  duration?: number; // in minutes
}

export interface NutritionInfo {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
  fiber?: number;
}

// Favorite Recipe
export interface FavoriteRecipe {
  id: string;
  user_id: string;
  recipe_id: string;
  created_at: string;
}

// Meal Plan
export interface MealPlan {
  id: string;
  user_id: string;
  date: string;
  meal_type: 'breakfast' | 'lunch' | 'dinner' | 'snack';
  recipe_id: string;
  recipe?: Recipe;
  created_at: string;
}

// Shopping List
export interface ShoppingListItem {
  id: string;
  user_id: string;
  name: string;
  quantity: number;
  unit: string;
  category: string;
  is_purchased: boolean;
  created_at: string;
}

// Filter Types
export interface RecipeFilters {
  cuisine_type?: string[];
  cooking_time_max?: number;
  difficulty?: ('easy' | 'medium' | 'hard')[];
  dietary_restrictions?: string[];
  available_ingredients?: string[];
}
