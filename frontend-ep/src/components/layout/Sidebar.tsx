// src/components/layout/Sidebar.tsx
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import UserProfileCard from "./UserProfileCard";
import IngredientInput from "./IngredientInput";
import MobileNavBar from "./MobileNavBar";
import { Link } from "@tanstack/react-router";

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
          <ScrollArea className="h-[320px] pr-2 mb-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div
                key={i}
                className="flex justify-between py-1 border-b border-orange-300"
              >
                <span className="font-medium">Potato</span>
                <span className="text-sm text-white/80">300g</span>
              </div>
            ))}
          </ScrollArea>

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
