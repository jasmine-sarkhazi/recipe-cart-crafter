import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { ChevronLeft, ChevronRight, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const DAYS = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"] as const;
const MEAL_TYPES = ["breakfast", "lunch", "dinner"] as const;

function getWeekStart(date: Date): string {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  d.setDate(diff);
  return d.toISOString().split("T")[0];
}

function addWeeks(dateStr: string, weeks: number): string {
  const d = new Date(dateStr);
  d.setDate(d.getDate() + weeks * 7);
  return d.toISOString().split("T")[0];
}

function formatWeekRange(weekStart: string): string {
  const start = new Date(weekStart + "T00:00:00");
  const end = new Date(start);
  end.setDate(end.getDate() + 6);
  const opts: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" };
  return `${start.toLocaleDateString(undefined, opts)} – ${end.toLocaleDateString(undefined, opts)}`;
}

const MealPlan = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const location = useLocation();
  const [weekStart, setWeekStart] = useState(() => getWeekStart(new Date()));
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [selectedDay, setSelectedDay] = useState<string>(DAYS[0]);
  const [selectedMeal, setSelectedMeal] = useState<string>(MEAL_TYPES[2]);
  const [selectedRecipeId, setSelectedRecipeId] = useState<string>("");

  useEffect(() => {
    const state = location.state as { scheduleRecipeId?: string } | null;
    if (state?.scheduleRecipeId) {
      setSelectedRecipeId(state.scheduleRecipeId);
      setAddDialogOpen(true);
      window.history.replaceState({}, "");
    }
  }, [location.state]);

  const { data: meals = [] } = useQuery({
    queryKey: ["meal_plan", weekStart],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("meal_plan")
        .select("*, recipes(name, image_url)")
        .eq("week_start", weekStart)
        .order("meal_type");
      if (error) throw error;
      return data;
    },
  });

  const { data: recipes = [] } = useQuery({
    queryKey: ["recipes"],
    queryFn: async () => {
      const { data, error } = await supabase.from("recipes").select("id, name");
      if (error) throw error;
      return data;
    },
  });

  const addMeal = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error("Not authenticated");
      const { error } = await supabase.from("meal_plan").insert({
        recipe_id: selectedRecipeId,
        day_of_week: selectedDay,
        meal_type: selectedMeal,
        week_start: weekStart,
        user_id: user.id,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["meal_plan", weekStart] });
      setAddDialogOpen(false);
      toast({ title: "Added!", description: "Meal added to your plan." });
    },
    onError: () => toast({ title: "Error", description: "Failed to add meal", variant: "destructive" }),
  });

  const deleteMeal = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("meal_plan").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["meal_plan", weekStart] }),
  });

  const openAddDialog = (day: string, meal: string) => {
    setSelectedDay(day);
    setSelectedMeal(meal);
    setSelectedRecipeId("");
    setAddDialogOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Meal Plan</h1>
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addWeeks(weekStart, -1))}><ChevronLeft className="h-4 w-4" /></Button>
            <span className="text-sm font-medium min-w-[160px] text-center">{formatWeekRange(weekStart)}</span>
            <Button variant="outline" size="icon" onClick={() => setWeekStart(addWeeks(weekStart, 1))}><ChevronRight className="h-4 w-4" /></Button>
          </div>
        </div>

        <div className="grid gap-3 grid-cols-1 sm:grid-cols-2 md:grid-cols-7">
          {DAYS.map((day) => {
            const dayMeals = meals.filter((m) => m.day_of_week === day);
            return (
              <Card key={day} className="min-h-[200px]">
                <CardHeader className="pb-2 pt-3 px-3"><h3 className="text-sm font-semibold text-center">{day}</h3></CardHeader>
                <CardContent className="px-3 pb-3 space-y-2">
                  {MEAL_TYPES.map((mealType) => {
                    const meal = dayMeals.find((m) => m.meal_type === mealType);
                    return (
                      <div key={mealType}>
                        <span className="text-[10px] uppercase tracking-wider text-muted-foreground">{mealType}</span>
                        {meal ? (
                          <div className="flex items-center justify-between gap-1 rounded-md bg-accent/50 px-2 py-1">
                            <span className="text-xs font-medium truncate">{(meal as any).recipes?.name}</span>
                            <button onClick={() => deleteMeal.mutate(meal.id)} className="text-muted-foreground hover:text-destructive shrink-0"><Trash2 className="h-3 w-3" /></button>
                          </div>
                        ) : (
                          <button onClick={() => openAddDialog(day, mealType)} className="w-full rounded-md border border-dashed border-muted-foreground/30 py-1 text-xs text-muted-foreground hover:border-primary hover:text-primary transition-colors">
                            <Plus className="h-3 w-3 inline mr-0.5" />Add
                          </button>
                        )}
                      </div>
                    );
                  })}
                </CardContent>
              </Card>
            );
          })}
        </div>

        <Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
          <DialogContent className="max-w-sm">
            <DialogHeader><DialogTitle className="font-serif">Add Meal — {selectedDay}</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium mb-1 block">Meal</label>
                <Select value={selectedMeal} onValueChange={setSelectedMeal}>
                  <SelectTrigger><SelectValue /></SelectTrigger>
                  <SelectContent>{MEAL_TYPES.map((m) => <SelectItem key={m} value={m} className="capitalize">{m}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Recipe</label>
                <Select value={selectedRecipeId} onValueChange={setSelectedRecipeId}>
                  <SelectTrigger><SelectValue placeholder="Choose a recipe" /></SelectTrigger>
                  <SelectContent>{recipes.map((r) => <SelectItem key={r.id} value={r.id}>{r.name}</SelectItem>)}</SelectContent>
                </Select>
              </div>
              <Button className="w-full" disabled={!selectedRecipeId} onClick={() => addMeal.mutate()}>Add to Plan</Button>
            </div>
          </DialogContent>
        </Dialog>
      </main>
    </div>
  );
};

export default MealPlan;
