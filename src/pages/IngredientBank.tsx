import { useState, useRef } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/hooks/use-toast";
import Navbar from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Camera, Upload, Loader2, Trash2, Image as ImageIcon } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

const IngredientBank = () => {
  const queryClient = useQueryClient();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { data: ingredients = [] } = useQuery({
    queryKey: ["ingredient_bank"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("ingredient_bank" as any)
        .select("*")
        .order("created_at", { ascending: false });
      if (error) throw error;
      return data as any[];
    },
  });

  const handleFile = async (file: File) => {
    if (!file.type.startsWith("image/")) {
      toast({ title: "Error", description: "Please select an image file.", variant: "destructive" });
      return;
    }

    setUploading(true);
    try {
      // Upload to storage
      const ext = file.name.split(".").pop() || "jpg";
      const fileName = `${crypto.randomUUID()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from("nutrition-labels")
        .upload(fileName, file);
      if (uploadError) throw uploadError;

      const { data: urlData } = supabase.storage
        .from("nutrition-labels")
        .getPublicUrl(fileName);
      const imageUrl = urlData.publicUrl;

      // Analyze with AI
      toast({ title: "Analyzing...", description: "Reading nutritional label with AI." });
      const { data: result, error: fnError } = await supabase.functions.invoke("analyze-nutrition", {
        body: { imageUrl },
      });
      if (fnError) throw fnError;

      const nutrition = result?.nutrition;
      if (!nutrition || !nutrition.name) {
        toast({ title: "Could not read label", description: "Try a clearer photo of the nutrition facts.", variant: "destructive" });
        return;
      }

      // Save to ingredient bank
      const { error: insertError } = await supabase.from("ingredient_bank" as any).insert({
        name: nutrition.name,
        brand: nutrition.brand || null,
        serving_size: nutrition.serving_size || null,
        calories: nutrition.calories ?? 0,
        total_fat: nutrition.total_fat ?? 0,
        saturated_fat: nutrition.saturated_fat ?? 0,
        trans_fat: nutrition.trans_fat ?? 0,
        cholesterol: nutrition.cholesterol ?? 0,
        sodium: nutrition.sodium ?? 0,
        total_carbs: nutrition.total_carbs ?? 0,
        dietary_fiber: nutrition.dietary_fiber ?? 0,
        total_sugars: nutrition.total_sugars ?? 0,
        protein: nutrition.protein ?? 0,
        image_url: imageUrl,
      } as any);
      if (insertError) throw insertError;

      queryClient.invalidateQueries({ queryKey: ["ingredient_bank"] });
      toast({ title: "Added!", description: `"${nutrition.name}" saved to your ingredient bank.` });
    } catch (err: any) {
      console.error(err);
      toast({ title: "Error", description: err.message || "Failed to process image", variant: "destructive" });
    } finally {
      setUploading(false);
    }
  };

  const deleteIngredient = async (id: string) => {
    const { error } = await supabase.from("ingredient_bank" as any).delete().eq("id", id);
    if (error) {
      toast({ title: "Error", description: "Failed to delete", variant: "destructive" });
      return;
    }
    queryClient.invalidateQueries({ queryKey: ["ingredient_bank"] });
  };

  const showPreview = (url: string) => {
    setPreviewUrl(url);
    setPreviewOpen(true);
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main className="container mx-auto px-4 py-8 max-w-5xl">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-3xl font-serif">Ingredient Bank</h1>
          <div className="flex gap-2">
            <input
              ref={cameraInputRef}
              type="file"
              accept="image/*"
              capture="environment"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={(e) => e.target.files?.[0] && handleFile(e.target.files[0])}
            />
            <Button
              onClick={() => cameraInputRef.current?.click()}
              disabled={uploading}
              className="gap-1.5"
            >
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Camera className="h-4 w-4" />}
              Take Photo
            </Button>
            <Button
              variant="outline"
              onClick={() => fileInputRef.current?.click()}
              disabled={uploading}
              className="gap-1.5"
            >
              <Upload className="h-4 w-4" /> Upload
            </Button>
          </div>
        </div>

        <p className="text-muted-foreground mb-6 text-sm">
          Snap a photo of a nutrition label to automatically extract and save nutritional info.
        </p>

        {uploading && (
          <Card className="mb-6">
            <CardContent className="py-8 text-center">
              <Loader2 className="h-8 w-8 animate-spin mx-auto mb-3 text-primary" />
              <p className="text-muted-foreground">Analyzing nutrition label...</p>
            </CardContent>
          </Card>
        )}

        {ingredients.length === 0 && !uploading ? (
          <Card>
            <CardContent className="py-12 text-center text-muted-foreground">
              <Camera className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p>No ingredients yet. Take a photo of a nutrition label to get started!</p>
            </CardContent>
          </Card>
        ) : (
          <div className="rounded-lg border bg-card overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead className="hidden sm:table-cell">Brand</TableHead>
                  <TableHead className="text-center">Calories</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Protein</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Carbs</TableHead>
                  <TableHead className="text-center hidden md:table-cell">Fat</TableHead>
                  <TableHead className="text-center hidden lg:table-cell">Serving</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {ingredients.map((ing: any) => (
                  <TableRow key={ing.id}>
                    <TableCell className="font-medium">{ing.name}</TableCell>
                    <TableCell className="hidden sm:table-cell text-muted-foreground text-sm">
                      {ing.brand || "—"}
                    </TableCell>
                    <TableCell className="text-center tabular-nums">{ing.calories ?? 0}</TableCell>
                    <TableCell className="text-center tabular-nums hidden md:table-cell">{ing.protein ?? 0}g</TableCell>
                    <TableCell className="text-center tabular-nums hidden md:table-cell">{ing.total_carbs ?? 0}g</TableCell>
                    <TableCell className="text-center tabular-nums hidden md:table-cell">{ing.total_fat ?? 0}g</TableCell>
                    <TableCell className="text-center hidden lg:table-cell text-sm text-muted-foreground">
                      {ing.serving_size || "—"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-1">
                        {ing.image_url && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => showPreview(ing.image_url)}
                            title="View photo"
                          >
                            <ImageIcon className="h-4 w-4" />
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => deleteIngredient(ing.id)}
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4" />
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

      <Dialog open={previewOpen} onOpenChange={setPreviewOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="font-serif">Nutrition Label</DialogTitle>
          </DialogHeader>
          {previewUrl && (
            <img
              src={previewUrl}
              alt="Nutrition label"
              className="w-full rounded-md"
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default IngredientBank;
