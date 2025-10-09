-- SnackIt Database Schema for Supabase

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Profiles Table
CREATE TABLE profiles (
    id UUID REFERENCES auth.users(id) PRIMARY KEY,
    email TEXT NOT NULL,
    username TEXT UNIQUE,
    full_name TEXT,
    avatar_url TEXT,
    dietary_preferences JSONB DEFAULT '{
        "diet_type": "any",
        "allergies": [],
        "dislikes": [],
        "preferred_cuisines": []
    }'::jsonb,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create index on username
CREATE INDEX IF NOT EXISTS idx_profiles_username ON profiles(username);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

-- Profiles Policies
CREATE POLICY "Users can view own profile"
    ON profiles FOR SELECT
    USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
    ON profiles FOR UPDATE
    USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
    ON profiles FOR INSERT
    WITH CHECK (auth.uid() = id);

-- Groceries Table
CREATE TABLE groceries (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    quantity NUMERIC DEFAULT 1,
    unit TEXT DEFAULT 'piece',
    expiry_date DATE,
    barcode TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE groceries ENABLE ROW LEVEL SECURITY;

-- Groceries Policies
CREATE POLICY "Users can view own groceries"
    ON groceries FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own groceries"
    ON groceries FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own groceries"
    ON groceries FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own groceries"
    ON groceries FOR DELETE
    USING (auth.uid() = user_id);

-- Recipes Table
CREATE TABLE recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    image_url TEXT,
    cuisine_type TEXT NOT NULL,
    cooking_time INTEGER NOT NULL, -- in minutes
    difficulty TEXT CHECK (difficulty IN ('easy', 'medium', 'hard')),
    servings INTEGER DEFAULT 4,
    ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
    instructions JSONB NOT NULL DEFAULT '[]'::jsonb,
    nutrition_info JSONB,
    tags TEXT[] DEFAULT '{}',
    created_by UUID REFERENCES auth.users(id),
    is_local BOOLEAN DEFAULT FALSE,
    location TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE recipes ENABLE ROW LEVEL SECURITY;

-- Recipes Policies (Public read, authenticated write)
CREATE POLICY "Anyone can view recipes"
    ON recipes FOR SELECT
    TO authenticated
    USING (TRUE);

CREATE POLICY "Authenticated users can create recipes"
    ON recipes FOR INSERT
    TO authenticated
    WITH CHECK (auth.uid() = created_by);

CREATE POLICY "Users can update own recipes"
    ON recipes FOR UPDATE
    TO authenticated
    USING (auth.uid() = created_by);

CREATE POLICY "Users can delete own recipes"
    ON recipes FOR DELETE
    TO authenticated
    USING (auth.uid() = created_by);

-- Favorite Recipes Table
CREATE TABLE favorite_recipes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, recipe_id)
);

ALTER TABLE favorite_recipes ENABLE ROW LEVEL SECURITY;

-- Favorite Recipes Policies
CREATE POLICY "Users can view own favorites"
    ON favorite_recipes FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add favorites"
    ON favorite_recipes FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can remove favorites"
    ON favorite_recipes FOR DELETE
    USING (auth.uid() = user_id);

-- Meal Plans Table
CREATE TABLE meal_plans (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    date DATE NOT NULL,
    meal_type TEXT CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
    recipe_id UUID REFERENCES recipes(id) ON DELETE CASCADE NOT NULL,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(user_id, date, meal_type)
);

ALTER TABLE meal_plans ENABLE ROW LEVEL SECURITY;

-- Meal Plans Policies
CREATE POLICY "Users can view own meal plans"
    ON meal_plans FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can create meal plans"
    ON meal_plans FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update meal plans"
    ON meal_plans FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete meal plans"
    ON meal_plans FOR DELETE
    USING (auth.uid() = user_id);

-- Shopping List Table
CREATE TABLE shopping_list (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
    name TEXT NOT NULL,
    quantity NUMERIC DEFAULT 1,
    unit TEXT DEFAULT 'piece',
    category TEXT NOT NULL,
    is_purchased BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE shopping_list ENABLE ROW LEVEL SECURITY;

-- Shopping List Policies
CREATE POLICY "Users can view own shopping list"
    ON shopping_list FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can add to shopping list"
    ON shopping_list FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update shopping list"
    ON shopping_list FOR UPDATE
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete from shopping list"
    ON shopping_list FOR DELETE
    USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_groceries_user_id ON groceries(user_id);
CREATE INDEX idx_groceries_category ON groceries(category);
CREATE INDEX idx_recipes_cuisine ON recipes(cuisine_type);
CREATE INDEX idx_recipes_difficulty ON recipes(difficulty);
CREATE INDEX idx_recipes_cooking_time ON recipes(cooking_time);
CREATE INDEX idx_favorite_recipes_user_id ON favorite_recipes(user_id);
CREATE INDEX idx_meal_plans_user_date ON meal_plans(user_id, date);
CREATE INDEX idx_shopping_list_user_id ON shopping_list(user_id);

-- Function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
    BEFORE UPDATE ON profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_groceries_updated_at
    BEFORE UPDATE ON groceries
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_recipes_updated_at
    BEFORE UPDATE ON recipes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample Recipes Data (Optional - for testing)
INSERT INTO recipes (title, description, cuisine_type, cooking_time, difficulty, servings, ingredients, instructions, nutrition_info, tags) VALUES
(
    'Classic Margherita Pizza',
    'A simple and delicious Italian pizza with fresh mozzarella, tomatoes, and basil',
    'Italian',
    30,
    'easy',
    4,
    '[
        {"name": "Pizza dough", "quantity": 1, "unit": "piece"},
        {"name": "Tomato sauce", "quantity": 200, "unit": "ml"},
        {"name": "Mozzarella cheese", "quantity": 200, "unit": "g"},
        {"name": "Fresh basil", "quantity": 10, "unit": "leaves"},
        {"name": "Olive oil", "quantity": 2, "unit": "tbsp"}
    ]'::jsonb,
    '[
        {"step": 1, "description": "Preheat oven to 475°F (245°C)"},
        {"step": 2, "description": "Roll out pizza dough on a floured surface"},
        {"step": 3, "description": "Spread tomato sauce evenly over dough"},
        {"step": 4, "description": "Add mozzarella cheese on top"},
        {"step": 5, "description": "Bake for 12-15 minutes until crust is golden"},
        {"step": 6, "description": "Top with fresh basil and olive oil before serving"}
    ]'::jsonb,
    '{"calories": 280, "protein": 12, "carbs": 35, "fat": 10}'::jsonb,
    ARRAY['quick', 'vegetarian', 'italian', 'pizza']
),
(
    'Chicken Tikka Masala',
    'Rich and creamy Indian curry with tender chicken pieces',
    'Indian',
    45,
    'medium',
    4,
    '[
        {"name": "Chicken breast", "quantity": 500, "unit": "g"},
        {"name": "Yogurt", "quantity": 100, "unit": "g"},
        {"name": "Tomato puree", "quantity": 400, "unit": "ml"},
        {"name": "Heavy cream", "quantity": 200, "unit": "ml"},
        {"name": "Garam masala", "quantity": 2, "unit": "tsp"},
        {"name": "Ginger", "quantity": 1, "unit": "tbsp"},
        {"name": "Garlic", "quantity": 3, "unit": "cloves"},
        {"name": "Onion", "quantity": 1, "unit": "piece"}
    ]'::jsonb,
    '[
        {"step": 1, "description": "Marinate chicken in yogurt and spices for 30 minutes", "duration": 30},
        {"step": 2, "description": "Grill or pan-fry chicken until cooked", "duration": 10},
        {"step": 3, "description": "Sauté onions, ginger, and garlic", "duration": 5},
        {"step": 4, "description": "Add tomato puree and spices, simmer", "duration": 10},
        {"step": 5, "description": "Add cream and cooked chicken", "duration": 5},
        {"step": 6, "description": "Simmer until sauce thickens, serve with rice or naan"}
    ]'::jsonb,
    '{"calories": 420, "protein": 35, "carbs": 18, "fat": 25}'::jsonb,
    ARRAY['indian', 'curry', 'spicy', 'main course']
),
(
    'Caesar Salad',
    'Fresh romaine lettuce with classic Caesar dressing and croutons',
    'American',
    15,
    'easy',
    2,
    '[
        {"name": "Romaine lettuce", "quantity": 1, "unit": "head"},
        {"name": "Parmesan cheese", "quantity": 50, "unit": "g"},
        {"name": "Croutons", "quantity": 1, "unit": "cup"},
        {"name": "Caesar dressing", "quantity": 4, "unit": "tbsp"},
        {"name": "Lemon juice", "quantity": 1, "unit": "tbsp"}
    ]'::jsonb,
    '[
        {"step": 1, "description": "Wash and chop romaine lettuce"},
        {"step": 2, "description": "Place lettuce in a large bowl"},
        {"step": 3, "description": "Add Caesar dressing and toss well"},
        {"step": 4, "description": "Top with Parmesan cheese and croutons"},
        {"step": 5, "description": "Drizzle with lemon juice and serve immediately"}
    ]'::jsonb,
    '{"calories": 320, "protein": 12, "carbs": 20, "fat": 22}'::jsonb,
    ARRAY['salad', 'quick', 'vegetarian', 'healthy']
);
