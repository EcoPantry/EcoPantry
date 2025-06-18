import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { useState } from "react";

export interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

interface AddIngredientModalProps {
  onAdd: (ingredient: Ingredient) => void;
}

const AddIngredientModal: React.FC<AddIngredientModalProps> = ({ onAdd }) => {
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: 0,
    unit: "",
    category: "",
  });

  const handleAdd = () => {
    if (!newIngredient.name || !newIngredient.unit || !newIngredient.category) return;
    onAdd(newIngredient);
    setNewIngredient({ name: "", quantity: 0, unit: "", category: "" });
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">+ Add</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add Ingredient</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input
              value={newIngredient.name}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  name: e.target.value,
                }))
              }
              placeholder="e.g. Tomato"
            />
          </div>
          <div>
            <Label>Quantity</Label>
            <Input
              type="number"
              value={newIngredient.quantity}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  quantity: parseFloat(e.target.value),
                }))
              }
              placeholder="e.g. 200"
            />
          </div>
          <div>
            <Label>Unit</Label>
            <Input
              value={newIngredient.unit}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  unit: e.target.value,
                }))
              }
              placeholder="e.g. g or ml"
            />
          </div>
          <div>
            <Label>Category</Label>
            <Input
              value={newIngredient.category}
              onChange={(e) =>
                setNewIngredient((prev) => ({
                  ...prev,
                  category: e.target.value,
                }))
              }
              placeholder="e.g. Protein, Grain, etc."
            />
          </div>
        </div>
        <DialogFooter>
          <Button onClick={handleAdd}>Add to Pantry</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AddIngredientModal;
