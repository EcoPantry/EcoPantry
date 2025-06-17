import { Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useEffect, useState } from "react";

const mockPantry = [
  { name: "Potato", quantity: 300, unit: "g" },
  { name: "Milk", quantity: 500, unit: "ml" },
  { name: "Carrot", quantity: 150, unit: "g" },
  { name: "Soy Sauce", quantity: 100, unit: "ml" },
];

const Pantry = () => {
  const [search, setSearch] = useState("");
  const [filteredPantry, setFilteredPantry] = useState(mockPantry);

  useEffect(() => {
    const filtered = mockPantry.filter((item) =>
      item.name.toLowerCase().includes(search.toLowerCase())
    );
    setFilteredPantry(filtered);
  }, [search]);

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
          <Button variant="outline" onClick={() => alert("Add Ingredient")}>
            + Add
          </Button>
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
              <span className="font-medium text-gray-800">{item.name}</span>
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