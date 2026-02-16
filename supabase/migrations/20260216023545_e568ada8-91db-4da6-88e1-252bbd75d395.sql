
-- Allow anyone to insert recipes (for adding from search)
CREATE POLICY "Anyone can insert recipes" ON public.recipes FOR INSERT WITH CHECK (true);

-- Allow anyone to insert recipe ingredients
CREATE POLICY "Anyone can insert recipe ingredients" ON public.recipe_ingredients FOR INSERT WITH CHECK (true);
