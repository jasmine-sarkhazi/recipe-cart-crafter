
-- Ingredient bank table
CREATE TABLE public.ingredient_bank (
  id uuid NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name text NOT NULL,
  brand text,
  serving_size text,
  calories numeric,
  total_fat numeric,
  saturated_fat numeric,
  trans_fat numeric,
  cholesterol numeric,
  sodium numeric,
  total_carbs numeric,
  dietary_fiber numeric,
  total_sugars numeric,
  protein numeric,
  image_url text,
  created_at timestamptz NOT NULL DEFAULT now()
);

ALTER TABLE public.ingredient_bank ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Ingredient bank is viewable by everyone"
  ON public.ingredient_bank FOR SELECT USING (true);

CREATE POLICY "Anyone can insert ingredients"
  ON public.ingredient_bank FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can update ingredients"
  ON public.ingredient_bank FOR UPDATE USING (true);

CREATE POLICY "Anyone can delete ingredients"
  ON public.ingredient_bank FOR DELETE USING (true);

-- Storage bucket for nutrition label photos
INSERT INTO storage.buckets (id, name, public) VALUES ('nutrition-labels', 'nutrition-labels', true);

CREATE POLICY "Anyone can upload nutrition labels"
  ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'nutrition-labels');

CREATE POLICY "Nutrition labels are publicly readable"
  ON storage.objects FOR SELECT USING (bucket_id = 'nutrition-labels');

CREATE POLICY "Anyone can delete nutrition labels"
  ON storage.objects FOR DELETE USING (bucket_id = 'nutrition-labels');
