
-- Add user_id to all user-facing tables
ALTER TABLE public.ingredient_bank ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.recipes ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.recipe_ingredients ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.meal_plan ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.shopping_list ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;
ALTER TABLE public.stores ADD COLUMN user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- Drop old permissive policies on ingredient_bank
DROP POLICY IF EXISTS "Ingredient bank is viewable by everyone" ON public.ingredient_bank;
DROP POLICY IF EXISTS "Anyone can insert ingredients" ON public.ingredient_bank;
DROP POLICY IF EXISTS "Anyone can update ingredients" ON public.ingredient_bank;
DROP POLICY IF EXISTS "Anyone can delete ingredients" ON public.ingredient_bank;

CREATE POLICY "Users can view own ingredients" ON public.ingredient_bank FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own ingredients" ON public.ingredient_bank FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own ingredients" ON public.ingredient_bank FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own ingredients" ON public.ingredient_bank FOR DELETE USING (auth.uid() = user_id);

-- Drop old policies on recipes
DROP POLICY IF EXISTS "Recipes are viewable by everyone" ON public.recipes;
DROP POLICY IF EXISTS "Anyone can insert recipes" ON public.recipes;

CREATE POLICY "Users can view own recipes" ON public.recipes FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipes" ON public.recipes FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipes" ON public.recipes FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipes" ON public.recipes FOR DELETE USING (auth.uid() = user_id);

-- Drop old policies on recipe_ingredients
DROP POLICY IF EXISTS "Recipe ingredients are viewable by everyone" ON public.recipe_ingredients;
DROP POLICY IF EXISTS "Anyone can insert recipe ingredients" ON public.recipe_ingredients;

CREATE POLICY "Users can view own recipe_ingredients" ON public.recipe_ingredients FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own recipe_ingredients" ON public.recipe_ingredients FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own recipe_ingredients" ON public.recipe_ingredients FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own recipe_ingredients" ON public.recipe_ingredients FOR DELETE USING (auth.uid() = user_id);

-- Drop old policies on meal_plan
DROP POLICY IF EXISTS "Meal plans are viewable by everyone" ON public.meal_plan;
DROP POLICY IF EXISTS "Anyone can insert meal plans" ON public.meal_plan;
DROP POLICY IF EXISTS "Anyone can update meal plans" ON public.meal_plan;
DROP POLICY IF EXISTS "Anyone can delete meal plans" ON public.meal_plan;

CREATE POLICY "Users can view own meal plans" ON public.meal_plan FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own meal plans" ON public.meal_plan FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own meal plans" ON public.meal_plan FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own meal plans" ON public.meal_plan FOR DELETE USING (auth.uid() = user_id);

-- Drop old policies on shopping_list
DROP POLICY IF EXISTS "Shopping list is viewable by everyone" ON public.shopping_list;
DROP POLICY IF EXISTS "Anyone can insert shopping items" ON public.shopping_list;
DROP POLICY IF EXISTS "Anyone can update shopping items" ON public.shopping_list;
DROP POLICY IF EXISTS "Anyone can delete shopping items" ON public.shopping_list;

CREATE POLICY "Users can view own shopping items" ON public.shopping_list FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own shopping items" ON public.shopping_list FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own shopping items" ON public.shopping_list FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own shopping items" ON public.shopping_list FOR DELETE USING (auth.uid() = user_id);

-- Drop old policies on stores
DROP POLICY IF EXISTS "Stores are viewable by everyone" ON public.stores;
DROP POLICY IF EXISTS "Anyone can insert stores" ON public.stores;

CREATE POLICY "Users can view own stores" ON public.stores FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert own stores" ON public.stores FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can update own stores" ON public.stores FOR UPDATE USING (auth.uid() = user_id);
CREATE POLICY "Users can delete own stores" ON public.stores FOR DELETE USING (auth.uid() = user_id);
