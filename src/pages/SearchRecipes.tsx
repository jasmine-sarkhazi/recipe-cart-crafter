import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Search, Plus, Loader2, Utensils, ExternalLink } from "lucide-react";

interface SearchIngredient {
  ingredient_name: string;
  default_quantity: number;
  default_unit: string;
}

interface SearchRecipe {
  name: string;
  description: string;
  instructions: string;
  source_url?: string;
  ingredients: SearchIngredient[];
}

const SearchRecipes = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchRecipe[]>([]);
  const [addingIndex, setAddingIndex] = useState<number | null>(null);

  const searchMutation = useMutation({
    mutationFn: async (searchQuery: string) => {
      const { data, error } = await supabase.functions.invoke("search-recipes", { body: { query: searchQuery } });
      if (error) throw error;
      return data.recipes as SearchRecipe[];
    },
    onSuccess: (data) => setResults(data || []),
    onError: () => toast({ title: "Error", description: "Search failed. Please try again.", variant: "destructive" }),
  });

  const addToLibrary = async (recipe: SearchRecipe, index: number) => {
    if (!user) return;
    setAddingIndex(index);
    try {
      const { data: newRecipe, error: recipeError } = await supabase
        .from("recipes")
        .insert({
          name: recipe.name,
          description: recipe.description,
          instructions: recipe.instructions,
          source_url: recipe.source_url || null,
          user_id: user.id,
        })
        .select("id")
        .single();
      if (recipeError) throw recipeError;

      if (recipe.ingredients?.length) {
        const ingredientRows = recipe.ingredients.map((ing) => ({
          recipe_id: newRecipe.id,
          ingredient_name: ing.ingredient_name,
          default_quantity: ing.default_quantity,
          default_unit: ing.default_unit,
          user_id: user.id,
        }));
        const { error: ingError } = await supabase.from("recipe_ingredients").insert(ingredientRows);
        if (ingError) throw ingError;
      }

      queryClient.invalidateQueries({ queryKey: ["recipes"] });
      toast({ title: "Added!", description: `"${recipe.name}" added to your library.` });
    } catch {
      toast({ title: "Error", description: "Failed to add recipe", variant: "destructive" });
    } finally {
      setAddingIndex(null);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) searchMutation.mutate(query.trim());
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-4xl">
        <section className="mb-8 text-center">
          <h1 className="text-3xl md:text-4xl font-serif mb-2">Find Recipes</h1>
          <p className="text-muted-foreground">Search for recipes and add them to your library.</p>
        </section>

        <form onSubmit={handleSearch} className="mb-8 flex gap-2 max-w-xl mx-auto">
          <Input placeholder="Search for a recipe... e.g. Thai green curry" value={query} onChange={(e) => setQuery(e.target.value)} className="flex-1" />
          <Button type="submit" disabled={searchMutation.isPending} className="gap-1.5">
            {searchMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />} Search
          </Button>
        </form>

        {searchMutation.isPending && (
          <div className="text-center py-12 text-muted-foreground">
            <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3" /><p>Searching for recipes...</p>
          </div>
        )}

        {!searchMutation.isPending && results.length > 0 && (
          <section className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((recipe, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="pb-2"><h3 className="text-lg font-serif">{recipe.name}</h3></CardHeader>
                <CardContent className="pb-3 flex-1">
                  <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{recipe.description}</p>
                  <div className="flex items-center gap-1 text-xs text-muted-foreground mb-1"><Utensils className="h-3 w-3" />{recipe.ingredients?.length ?? 0} ingredients</div>
                  {recipe.source_url && <a href={recipe.source_url} target="_blank" rel="noopener noreferrer" className="text-xs text-primary hover:underline inline-flex items-center gap-1"><ExternalLink className="h-3 w-3" /> Source</a>}
                </CardContent>
                <CardFooter>
                  <Button className="w-full gap-1.5" onClick={() => addToLibrary(recipe, i)} disabled={addingIndex === i}>
                    {addingIndex === i ? <Loader2 className="h-4 w-4 animate-spin" /> : <Plus className="h-4 w-4" />} Add to Library
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </section>
        )}

        {!searchMutation.isPending && results.length === 0 && !searchMutation.isIdle && (
          <p className="text-center text-muted-foreground py-12">No recipes found. Try a different search.</p>
        )}
      </main>
    </div>
  );
};

export default SearchRecipes;
