import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Utensils, CalendarPlus } from "lucide-react";

interface RecipeCardProps {
  id: string;
  name: string;
  description: string | null;
  imageUrl: string | null;
  ingredientCount: number;
  onViewDetails: (id: string) => void;
  onAddToList: (id: string) => void;
  onSchedule: (id: string) => void;
}

const RecipeCard = ({ id, name, description, imageUrl, ingredientCount, onViewDetails, onAddToList, onSchedule }: RecipeCardProps) => {
  return (
    <Card className="group overflow-hidden transition-all hover:shadow-lg hover:-translate-y-1">
      <div
        className="h-48 bg-muted bg-cover bg-center transition-transform group-hover:scale-105"
        style={{ backgroundImage: `url(${imageUrl || "/placeholder.svg"})` }}
      />
      <CardHeader className="pb-2">
        <h3 className="text-xl font-serif">{name}</h3>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{description}</p>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <Utensils className="h-3 w-3" />
          {ingredientCount} ingredients
        </div>
      </CardContent>
      <CardFooter className="gap-2">
        <Button variant="outline" size="sm" className="flex-1" onClick={() => onViewDetails(id)}>
          View Recipe
        </Button>
        <Button size="sm" className="gap-1" onClick={() => onAddToList(id)}>
          <ShoppingCart className="h-3.5 w-3.5" />
        </Button>
        <Button variant="secondary" size="sm" className="gap-1" onClick={() => onSchedule(id)}>
          <CalendarPlus className="h-3.5 w-3.5" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RecipeCard;
