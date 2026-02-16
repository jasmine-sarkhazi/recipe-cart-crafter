import { useState } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { ShoppingCart, ChefHat, CalendarPlus, Utensils, Plus } from "lucide-react";
import { Input } from "@/components/ui/input";
import { format } from "date-fns";

function getTodayDayName(): string { return format(new Date(), "EEEE"); }

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

const Index = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const todayName = getTodayDayName();
  const weekStart = getWeekStart(new Date());
  const [newItem, setNewItem] = useState("");

  const addGroceryItem = async () => {
    if (!newItem.trim() || !user) return;
    const { error } = await supabase.from("shopping_list").insert({ ingredient_name: newItem.trim(), user_id: user.id });
    if (error) { toast({ title: "Error", description: "Failed to add item", variant: "destructive" }); return; }
    setNewItem("");
    queryClient.invalidateQueries({ queryKey: ["shopping_list_home"] });
    queryClient.invalidateQueries({ queryKey: ["shopping_list_count"] });
  };

  const { data: todayMeals = [] } = useQuery({
    queryKey: ["meal_plan_today", weekStart, todayName],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plan")
        .select("*, recipes(name, image_url, id)")
        .eq("week_start", weekStart)
        .eq("day_of_week", todayName)
        .order("meal_type");
      if (error) throw error;
      return data;
    },
  });

  const { data: shoppingItems = [] } = useQuery({
    queryKey: ["shopping_list_home"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shopping_list").select("*").eq("is_purchased", false).order("created_at", { ascending: true }).limit(10);
      if (error) throw error;
      return data;
    },
  });

  const { data: totalCount } = useQuery({
    queryKey: ["shopping_list_count"],
    queryFn: async () => {
      const { count, error } = await supabase.from("shopping_list").select("*", { count: "exact", head: true }).eq("is_purchased", false);
      if (error) throw error;
      return count ?? 0;
    },
  });

  const togglePurchased = async (id: string, current: boolean) => {
    await supabase.from("shopping_list").update({ is_purchased: !current }).eq("id", id);
  };

  const addMealIngredientsToList = async (recipeId: string) => {
    if (!user) return;
    const { data: ingredients, error } = await supabase.from("recipe_ingredients").select("*").eq("recipe_id", recipeId);
    if (error) return;
    const items = ingredients.map((ing) => ({
      ingredient_name: ing.ingredient_name,
      quantity: ing.default_quantity || 1,
      unit: ing.default_unit || "pieces",
      user_id: user.id,
    }));
    await supabase.from("shopping_list").insert(items);
    toast({ title: "Added!", description: `${items.length} ingredients added to your shopping list.` });
  };

  const mealOrder = { breakfast: 0, lunch: 1, dinner: 2 };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-3xl">
        <section className="mb-8 text-center">
          <h1 className="text-4xl md:text-5xl font-serif mb-1">{format(new Date(), "EEEE")}</h1>
          <p className="text-muted-foreground">{format(new Date(), "MMMM d, yyyy")}</p>
        </section>

        <section className="mb-10">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif flex items-center gap-2"><Utensils className="h-5 w-5 text-primary" /> Today's Meals</h2>
            <Button variant="outline" size="sm" onClick={() => navigate("/meal-plan")}><CalendarPlus className="h-4 w-4 mr-1" /> Plan Week</Button>
          </div>
          {todayMeals.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground"><ChefHat className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>No meals planned for today.</p><Button variant="link" onClick={() => navigate("/meal-plan")} className="mt-1">Add meals to your plan →</Button></CardContent></Card>
          ) : (
            <div className="grid gap-3 sm:grid-cols-3">
              {todayMeals.sort((a, b) => (mealOrder[a.meal_type as keyof typeof mealOrder] ?? 9) - (mealOrder[b.meal_type as keyof typeof mealOrder] ?? 9)).map((meal) => (
                <Card key={meal.id} className="relative overflow-hidden">
                  <CardHeader className="pb-1 pt-3 px-4"><span className="text-[10px] uppercase tracking-wider text-muted-foreground">{meal.meal_type}</span></CardHeader>
                  <CardContent className="px-4 pb-3">
                    <h3 className="font-serif text-lg">{(meal as any).recipes?.name}</h3>
                    <Button variant="ghost" size="sm" className="mt-2 gap-1 text-xs" onClick={() => addMealIngredientsToList((meal as any).recipes?.id)}>
                      <ShoppingCart className="h-3 w-3" /> Add ingredients
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>

        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-serif flex items-center gap-2"><ShoppingCart className="h-5 w-5 text-primary" /> Grocery List</h2>
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => navigate("/shopping")}>View All{totalCount ? ` (${totalCount})` : ""}</Button>
            </div>
          </div>
          <div className="flex gap-2 mb-4">
            <Input placeholder="Add a grocery item..." value={newItem} onChange={(e) => setNewItem(e.target.value)} onKeyDown={(e) => e.key === "Enter" && addGroceryItem()} />
            <Button onClick={addGroceryItem} size="sm" className="gap-1 shrink-0"><Plus className="h-4 w-4" /> Add</Button>
          </div>
          {shoppingItems.length === 0 ? (
            <Card><CardContent className="py-8 text-center text-muted-foreground"><ShoppingCart className="h-8 w-8 mx-auto mb-2 opacity-50" /><p>Your grocery list is empty.</p></CardContent></Card>
          ) : (
            <Card>
              <CardContent className="divide-y py-0">
                {shoppingItems.map((item) => (
                  <label key={item.id} className="flex items-center gap-3 py-3 cursor-pointer hover:bg-muted/30 transition-colors">
                    <Checkbox checked={item.is_purchased} onCheckedChange={() => togglePurchased(item.id, item.is_purchased)} />
                    <span className={`flex-1 text-sm ${item.is_purchased ? "line-through text-muted-foreground" : ""}`}>{item.ingredient_name}</span>
                    <span className="text-xs text-muted-foreground">{item.quantity} {item.unit}</span>
                  </label>
                ))}
              </CardContent>
            </Card>
          )}
        </section>
      </main>
    </div>
  );
};

export default Index;
