import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Trash2 } from "lucide-react";

const UNITS = ["pieces", "cups", "lbs", "oz", "tbsp", "tsp", "cloves", "head", "gal"];

interface ShoppingItemProps {
  id: string;
  ingredientName: string;
  quantity: number;
  unit: string;
  store: string | null;
  isPurchased: boolean;
  stores: string[];
  onUpdate: (id: string, fields: Record<string, unknown>) => void;
  onDelete: (id: string) => void;
}

const ShoppingItem = ({ id, ingredientName, quantity, unit, store, isPurchased, stores, onUpdate, onDelete }: ShoppingItemProps) => {
  return (
    <div className={`flex flex-wrap items-center gap-2 sm:gap-3 rounded-lg border bg-card p-3 transition-opacity ${isPurchased ? "opacity-50" : ""}`}>
      <Checkbox
        checked={isPurchased}
        onCheckedChange={(checked) => onUpdate(id, { is_purchased: !!checked })}
      />
      <span className={`min-w-[100px] flex-1 sm:flex-none sm:min-w-[120px] text-sm font-medium ${isPurchased ? "line-through" : ""}`}>
        {ingredientName}
      </span>
      <Button variant="ghost" size="icon" onClick={() => onDelete(id)} className="text-destructive hover:text-destructive sm:order-last ml-auto sm:ml-0">
        <Trash2 className="h-4 w-4" />
      </Button>
      <div className="flex items-center gap-2 w-full sm:w-auto">
        <Input
          type="number"
          value={quantity}
          onChange={(e) => onUpdate(id, { quantity: Number(e.target.value) })}
          className="w-20"
          min={0}
          step={0.25}
        />
        <Select value={unit} onValueChange={(val) => onUpdate(id, { unit: val })}>
          <SelectTrigger className="w-24">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {UNITS.map((u) => (
              <SelectItem key={u} value={u}>{u}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={store || "none"} onValueChange={(val) => onUpdate(id, { store: val === "none" ? null : val })}>
          <SelectTrigger className="flex-1 sm:w-36">
            <SelectValue placeholder="Store" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No store</SelectItem>
            {stores.map((s) => (
              <SelectItem key={s} value={s}>{s}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default ShoppingItem;
