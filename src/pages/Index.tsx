import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import RecipeCard from "@/components/RecipeCard";
import RecipeDetail from "@/components/RecipeDetail";

const Index = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);

  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("*, recipe_ingredients(id)");
      if (error) throw error;
      return data;
    },
  });

  const { data: selectedRecipe } = useQuery({
    queryKey: ["recipe", selectedRecipeId],
    enabled: !!selectedRecipeId,
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, recipe_ingredients(*)")
        .eq("id", selectedRecipeId!)
        .single();
      if (error) throw error;
      return data;
    },
  });

  const addRecipeToList = async (recipeId: string) => {
    const { data: ingredients, error } = await supabase
      .from("recipe_ingredients")
      .select("*")
      .eq("recipe_id", recipeId);
    if (error) {
      toast({ title: "Error", description: "Failed to load ingredients", variant: "destructive" });
      return;
    }
    const items = ingredients.map((ing) => ({
      ingredient_name: ing.ingredient_name,
      quantity: ing.default_quantity || 1,
      unit: ing.default_unit || "pieces",
    }));
    const { error: insertError } = await supabase.from("shopping_list").insert(items);
    if (insertError) {
      toast({ title: "Error", description: "Failed to add items", variant: "destructive" });
      return;
    }
    toast({ title: "Added!", description: `${items.length} ingredients added to your shopping list.` });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8">
        <section className="mb-10 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-3">What's Cooking?</h1>
          <p className="text-lg text-muted-foreground max-w-md mx-auto">
            Browse recipes and build your grocery list in one place.
          </p>
        </section>

        <section className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {recipes.map((recipe) => (
            <RecipeCard
              key={recipe.id}
              id={recipe.id}
              name={recipe.name}
              description={recipe.description}
              imageUrl={recipe.image_url}
              ingredientCount={recipe.recipe_ingredients?.length ?? 0}
              onViewDetails={setSelectedRecipeId}
              onAddToList={addRecipeToList}
            />
          ))}
        </section>
      </main>

      <RecipeDetail
        open={!!selectedRecipeId}
        onOpenChange={(open) => !open && setSelectedRecipeId(null)}
        recipe={selectedRecipe ?? null}
        ingredients={selectedRecipe?.recipe_ingredients ?? []}
        onAddToList={() => {
          if (selectedRecipeId) {
            addRecipeToList(selectedRecipeId);
            setSelectedRecipeId(null);
          }
        }}
      />
    </div>
  );
};

export default Index;
