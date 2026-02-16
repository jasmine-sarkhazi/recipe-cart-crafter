import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import RecipeDetail from "@/components/RecipeDetail";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { ShoppingCart, CalendarPlus, Eye, ExternalLink } from "lucide-react";

const Recipes = () => {
  const [selectedRecipeId, setSelectedRecipeId] = useState<string | null>(null);
  const navigate = useNavigate();

  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("recipes")
        .select("*, recipe_ingredients(id)")
        .order("created_at", { ascending: false });
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

  const handleSchedule = (recipeId: string) => {
    navigate("/meal-plan", { state: { scheduleRecipeId: recipeId } });
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">My Recipes</h1>
          <Button onClick={() => navigate("/search")} variant="outline">
            + Find New Recipes
          </Button>
        </div>

        {recipes.length === 0 ? (
          <p className="text-center text-muted-foreground py-12">
            No recipes yet. Use "Find New Recipes" to search and add some!
          </p>
        ) : (
          <div className="rounded-lg border bg-card">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Description</TableHead>
                  <TableHead className="text-center">Ingredients</TableHead>
                  <TableHead className="hidden md:table-cell">Source</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recipes.map((recipe) => (
                  <TableRow key={recipe.id}>
                    <TableCell className="font-medium font-serif">{recipe.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm max-w-[200px] truncate">
                      {recipe.description}
                    </TableCell>
                    <TableCell className="text-center text-sm">
                      {recipe.recipe_ingredients?.length ?? 0}
                    </TableCell>
                    <TableCell className="hidden md:table-cell">
                      {(recipe as any).source_url ? (
                        <a
                          href={(recipe as any).source_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-primary hover:underline inline-flex items-center gap-1 text-sm"
                        >
                          <ExternalLink className="h-3 w-3" /> Link
                        </a>
                      ) : (
                        <span className="text-muted-foreground text-sm">—</span>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        <Button variant="ghost" size="icon" onClick={() => setSelectedRecipeId(recipe.id)} title="View details">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => addRecipeToList(recipe.id)} title="Add to shopping list">
                          <ShoppingCart className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" onClick={() => handleSchedule(recipe.id)} title="Schedule">
                          <CalendarPlus className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
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

export default Recipes;
