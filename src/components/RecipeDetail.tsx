import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

interface Ingredient {
  id: string;
  ingredient_name: string;
  default_quantity: number | null;
  default_unit: string | null;
}

interface RecipeDetailProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  recipe: {
    name: string;
    description: string | null;
    instructions: string | null;
    image_url: string | null;
  } | null;
  ingredients: Ingredient[];
  onAddToList: () => void;
}

const RecipeDetail = ({ open, onOpenChange, recipe, ingredients, onAddToList }: RecipeDetailProps) => {
  if (!recipe) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="font-serif text-2xl">{recipe.name}</DialogTitle>
        </DialogHeader>
        <p className="text-muted-foreground">{recipe.description}</p>

        <div>
          <h4 className="mb-2 font-semibold">Ingredients</h4>
          <ul className="space-y-1">
            {ingredients.map((ing) => (
              <li key={ing.id} className="flex items-center gap-2 text-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                {ing.default_quantity} {ing.default_unit} {ing.ingredient_name}
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h4 className="mb-2 font-semibold">Instructions</h4>
          <p className="text-sm text-muted-foreground whitespace-pre-line">{recipe.instructions}</p>
        </div>

        <Button className="w-full gap-2" onClick={onAddToList}>
          <ShoppingCart className="h-4 w-4" />
          Add All Ingredients to Shopping List
        </Button>
      </DialogContent>
    </Dialog>
  );
};

export default RecipeDetail;
