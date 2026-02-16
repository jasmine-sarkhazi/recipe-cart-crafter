import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { useAuth } from "@/hooks/useAuth";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import ShoppingItem from "@/components/ShoppingItem";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Plus } from "lucide-react";

const Shopping = () => {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  const [newItem, setNewItem] = useState("");
  const [groupByStore, setGroupByStore] = useState(false);

  const { data: items = [] } = useQuery({
    queryKey: ["shopping_list"],
    queryFn: async () => {
      const { data, error } = await supabase.from("shopping_list").select("*").order("created_at", { ascending: true });
      if (error) throw error;
      return data;
    },
  });

  const { data: stores = [] } = useQuery({
    queryKey: ["stores"],
    queryFn: async () => {
      const { data, error } = await supabase.from("stores").select("name").order("name");
      if (error) throw error;
      return data.map((s) => s.name);
    },
  });

  const updateItem = useMutation({
    mutationFn: async ({ id, fields }: { id: string; fields: Record<string, unknown> }) => {
      const { error } = await supabase.from("shopping_list").update(fields).eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping_list"] }),
  });

  const deleteItem = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase.from("shopping_list").delete().eq("id", id);
      if (error) throw error;
    },
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["shopping_list"] }),
  });

  const addItem = async () => {
    if (!newItem.trim() || !user) return;
    const { error } = await supabase.from("shopping_list").insert({ ingredient_name: newItem.trim(), user_id: user.id });
    if (error) {
      toast({ title: "Error", description: "Failed to add item", variant: "destructive" });
      return;
    }
    setNewItem("");
    queryClient.invalidateQueries({ queryKey: ["shopping_list"] });
  };

  const grouped = groupByStore
    ? items.reduce<Record<string, typeof items>>((acc, item) => {
        const key = item.store || "Unassigned";
        if (!acc[key]) acc[key] = [];
        acc[key].push(item);
        return acc;
      }, {})
    : null;

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 pb-20 md:pb-8 max-w-2xl">
        <h1 className="text-3xl font-serif mb-6">Shopping List</h1>

        <div className="mb-6 flex gap-2">
          <Input
            placeholder="Add an ingredient..."
            value={newItem}
            onChange={(e) => setNewItem(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && addItem()}
          />
          <Button onClick={addItem} className="gap-1">
            <Plus className="h-4 w-4" /> Add
          </Button>
        </div>

        <div className="mb-4 flex items-center gap-2">
          <Switch checked={groupByStore} onCheckedChange={setGroupByStore} />
          <span className="text-sm text-muted-foreground">Group by store</span>
        </div>

        {items.length === 0 && (
          <p className="text-center text-muted-foreground py-12">
            Your shopping list is empty. Add items from recipes or manually above.
          </p>
        )}

        {grouped
          ? Object.entries(grouped).sort(([a], [b]) => a.localeCompare(b)).map(([storeName, storeItems]) => (
              <div key={storeName} className="mb-6">
                <h2 className="mb-2 text-lg font-semibold text-primary">{storeName}</h2>
                <div className="space-y-2">
                  {storeItems.map((item) => (
                    <ShoppingItem
                      key={item.id}
                      id={item.id}
                      ingredientName={item.ingredient_name}
                      quantity={item.quantity ?? 1}
                      unit={item.unit ?? "pieces"}
                      store={item.store}
                      isPurchased={item.is_purchased}
                      stores={stores}
                      onUpdate={(id, fields) => updateItem.mutate({ id, fields })}
                      onDelete={(id) => deleteItem.mutate(id)}
                    />
                  ))}
                </div>
              </div>
            ))
          : (
            <div className="space-y-2">
              {items.map((item) => (
                <ShoppingItem
                  key={item.id}
                  id={item.id}
                  ingredientName={item.ingredient_name}
                  quantity={item.quantity ?? 1}
                  unit={item.unit ?? "pieces"}
                  store={item.store}
                  isPurchased={item.is_purchased}
                  stores={stores}
                  onUpdate={(id, fields) => updateItem.mutate({ id, fields })}
                  onDelete={(id) => deleteItem.mutate(id)}
                />
              ))}
            </div>
          )}
      </main>
    </div>
  );
};

export default Shopping;
