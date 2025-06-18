import { Link } from "@tanstack/react-router";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";
import AddIngredientModal from "@/components/layout/AddIngredientModal";

interface Ingredient {
  name: string;
  quantity: number;
  unit: string;
  category: string;
}

const Pantry = () => {
  const [search, setSearch] = useState("");
  const [pantry, setPantry] = useState<Ingredient[]>([
    { name: "Potato", quantity: 300, unit: "g", category: "Vegetable" },
    { name: "Milk", quantity: 500, unit: "ml", category: "Dairy" },
    { name: "Carrot", quantity: 150, unit: "g", category: "Vegetable" },
    { name: "Soy Sauce", quantity: 100, unit: "ml", category: "Condiment" },
    { name: "Olive Oil", quantity: 250, unit: "ml", category: "Oil" },
    { name: "Rice", quantity: 1000, unit: "g", category: "Grain" },
    { name: "Chicken Breast", quantity: 500, unit: "g", category: "Meat" },
    { name: "Eggs", quantity: 12, unit: "pcs", category: "Dairy" },
    { name: "Salt", quantity: 200, unit: "g", category: "Spice" },
    { name: "Pepper", quantity: 50, unit: "g", category: "Spice" },
  ]);
  const [filteredPantry, setFilteredPantry] = useState<Ingredient[]>([]);

  // Modal form state
  const [newIngredient, setNewIngredient] = useState<Ingredient>({
    name: "",
    quantity: 0,
    unit: "",
    category: "",
  });

  useEffect(() => {
    const filtered = pantry.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPantry(filtered);
  }, [search, pantry]);

  return (
    <div className="p-6">
      <Link
        to="/"
        className="flex items-center justify-between mb-4 hover:opacity-80 transition"
      >
        <h1 className="text-2xl font-bold">Your Pantry</h1>
      </Link>

      <div className="max-w-[720px] mx-auto mb-6">
        <div className="flex gap-2">
          <Input
            placeholder="Search ingredient..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          <AddIngredientModal onAdd={(ingredient: Ingredient) => setPantry(prev => [...prev, ingredient])} />
        </div>
      </div>

      <div className="max-w-[720px] mx-auto bg-white rounded-lg shadow-md p-4 space-y-3">
        {filteredPantry.length === 0 ? (
          <p className="text-gray-500 text-center">No ingredients found.</p>
        ) : (
          filteredPantry.map((item, idx) => (
            <div
              key={idx}
              className="flex justify-between items-center border-b border-gray-200 pb-2 last:border-b-0"
            >
              <span className="font-medium text-gray-800">
                {item.name} <span className="text-xs text-gray-500">({item.category})</span>
              </span>
              <span className="text-sm text-gray-600">
                {item.quantity} {item.unit}
              </span>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Pantry;