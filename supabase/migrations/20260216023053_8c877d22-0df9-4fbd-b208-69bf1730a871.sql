
-- Create meal_plan table for weekly scheduling
CREATE TABLE public.meal_plan (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  recipe_id UUID NOT NULL REFERENCES public.recipes(id) ON DELETE CASCADE,
  day_of_week TEXT NOT NULL CHECK (day_of_week IN ('Monday','Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday')),
  meal_type TEXT NOT NULL DEFAULT 'dinner' CHECK (meal_type IN ('breakfast','lunch','dinner')),
  week_start DATE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.meal_plan ENABLE ROW LEVEL SECURITY;

-- Public access policies (matching existing app pattern - no auth)
CREATE POLICY "Meal plans are viewable by everyone" ON public.meal_plan FOR SELECT USING (true);
CREATE POLICY "Anyone can insert meal plans" ON public.meal_plan FOR INSERT WITH CHECK (true);
CREATE POLICY "Anyone can update meal plans" ON public.meal_plan FOR UPDATE USING (true);
CREATE POLICY "Anyone can delete meal plans" ON public.meal_plan FOR DELETE USING (true);
