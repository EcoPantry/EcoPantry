// src/components/layout/Sidebar.tsx
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfileCard from "./UserProfileCard";
import IngredientInput from "./IngredientInput";
import MobileNavBar from "./MobileNavBar";
import { Link } from "@tanstack/react-router";
import SidebarIngredientList from "./SidebarIngredientList";

const Sidebar = () => {
  return (
    <>
      {/* Desktop sidebar */}
      <div className="hidden md:flex md:flex-col w-72 h-screen bg-orange-400 text-white p-4 justify-between">
        {/* Top Section: Title + Add Button */}
        <div>
          <Link to="/" className="flex items-center justify-between mb-4 hover:opacity-80 transition">
            <h1 className="text-2xl font-bold">EcoPantry</h1>
          </Link>

          {/* Ingredient Search */}
          <div className="mb-4">
            <div className="relative">
              <IngredientInput />
            </div>
          </div>

          {/* Scrollable Ingredient List */}
          <SidebarIngredientList
            ingredients={ingredients} // Example ingredients
          />

          {/* Enter Ingredients */}
          <Input placeholder="Enter ingredients" className="text-black" />
        </div>

        {/* Bottom User Section */}
        <div>
					<UserProfileCard />
				</div>
      </div>

      {/* Mobile bottom nav */}
      <div className="fixed bottom-0 left-0 right-0 bg-orange-400 text-white flex justify-around md:hidden z-50 py-2">
        <MobileNavBar />
      </div>
    </>
  );
}
export default Sidebar;

const ingredients = [
  { name: "Potato", quantity: 300, unit: "g" },
  { name: "Soy Sauce", quantity: 30, unit: "ml" },
  { name: "Olive Oil", quantity: 50, unit: "ml" },
  { name: "Garlic", quantity: 2, unit: "cloves" },
  { name: "Salt", quantity: 1, unit: "tsp" },
  { name: "Pepper", quantity: 0.5, unit: "tsp" },
  { name: "Onion", quantity: 1, unit: "pc" },
  { name: "Chicken Breast", quantity: 200, unit: "g" },
  { name: "Broccoli", quantity: 150, unit: "g" },
  { name: "Carrot", quantity: 100, unit: "g" },
  { name: "Rice", quantity: 200, unit: "g" },
  { name: "Egg", quantity: 2, unit: "pcs" },
  { name: "Cheese", quantity: 100, unit: "g" },
]