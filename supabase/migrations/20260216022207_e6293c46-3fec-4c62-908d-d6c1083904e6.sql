
-- Stores table
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Stores are viewable by everyone" ON public.stores FOR SELECT USING (true);
CREATE POLICY "Anyone can insert stores" ON public.stores FOR INSERT WITH CHECK (true);

-- Recipes table
CREATE TABLE public.recipes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  description TEXT,
  image_url TEXT,
  instructions TEXT,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.recipes ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipes are viewable by everyone" ON public.recipes FOR SELECT USING (true);

-- Recipe ingredients table
CREATE TABLE public.recipe_ingredients (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  ingredient_name TEXT NOT NULL,
  default_quantity NUMERIC,
  default_unit TEXT
);
ALTER TABLE public.recipe_ingredients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Recipe ingredients are viewable by everyone" ON public.recipe_ingredients FOR SELECT USING (true);

-- Shopping list table
CREATE TABLE public.shopping_list (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  ingredient_name TEXT NOT NULL,
  quantity NUMERIC DEFAULT 1,
  unit TEXT DEFAULT 'pieces',
  store TEXT,
  is_purchased BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);
ALTER TABLE public.shopping_list ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Shopping list is viewable by everyone" ON public.shopping_list FOR SELECT USING (true);
CREATE POLICY "Anyone can insert shopping items" ON public.shopping_list FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update shopping items" ON public.shopping_list FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete shopping items" ON public.shopping_list FOR DELETE USING (true);

-- Seed stores
INSERT INTO public.stores (name) VALUES ('Costco'), ('Trader Joe''s'), ('Walmart'), ('Whole Foods'), ('Aldi');

-- Seed recipes
INSERT INTO public.recipes (id, name, description, image_url, instructions) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Spaghetti Bolognese', 'Classic Italian pasta with rich meat sauce', '/placeholder.svg', 'Cook spaghetti. Brown beef with onion and garlic. Add tomato sauce, simmer 20 min. Serve over pasta.'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Chicken Stir Fry', 'Quick and colorful Asian-inspired dish', '/placeholder.svg', 'Slice chicken and veggies. Stir fry chicken until golden. Add veggies, soy sauce, and ginger. Serve with rice.'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Caesar Salad', 'Crisp romaine with creamy Caesar dressing', '/placeholder.svg', 'Wash and chop romaine. Toss with Caesar dressing, croutons, and parmesan. Serve immediately.'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Pancakes', 'Fluffy homemade breakfast pancakes', '/placeholder.svg', 'Mix flour, eggs, milk, and butter. Pour batter on hot griddle. Flip when bubbles form. Serve with syrup.');

-- Seed ingredients
INSERT INTO public.recipe_ingredients (recipe_id, ingredient_name, default_quantity, default_unit) VALUES
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Spaghetti', 1, 'lbs'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Ground Beef', 1, 'lbs'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Tomato Sauce', 2, 'cups'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Onion', 1, 'pieces'),
  ('a1b2c3d4-e5f6-7890-abcd-ef1234567890', 'Garlic', 3, 'cloves'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Chicken Breast', 1, 'lbs'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Bell Pepper', 2, 'pieces'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Soy Sauce', 3, 'tbsp'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Ginger', 1, 'tbsp'),
  ('b2c3d4e5-f6a7-8901-bcde-f12345678901', 'Rice', 2, 'cups'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Romaine Lettuce', 1, 'head'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Caesar Dressing', 0.5, 'cups'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Croutons', 1, 'cups'),
  ('c3d4e5f6-a7b8-9012-cdef-123456789012', 'Parmesan', 0.25, 'cups'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Flour', 2, 'cups'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Eggs', 2, 'pieces'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Milk', 1.5, 'cups'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Butter', 3, 'tbsp'),
  ('d4e5f6a7-b8c9-0123-defa-234567890123', 'Maple Syrup', 0.25, 'cups');
