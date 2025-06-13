// src/components/layout/RecipeSearchBar.tsx
import { useState } from "react";
import { Search, Filter, SlidersHorizontal, List } from "lucide-react";

const RecipeSearchBar = ({
  onSearch,
  onFilter,
  onSort,
  onView,
}: {
  onSearch?: (value: string) => void;
  onFilter?: () => void;
  onSort?: () => void;
  onView?: () => void;
}) => {
  const [value, setValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setValue(e.target.value);
    onSearch?.(e.target.value);
  };

  return (
    <div className="mb-6 w-full">
      <div className="flex flex-col gap-2 md:flex-row md:items-center md:gap-4 w-full">
        {/* Search input */}
        <div className="flex items-center w-full border rounded-md px-3 py-2 bg-white shadow-sm focus-within:ring-2 ring-orange-300">
          <Search className="w-5 h-5 mr-2 text-gray-500" />
          <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder="Search for recipes"
            className="flex-1 bg-transparent outline-none text-base"
          />
          {/* Desktop: icon-only buttons on the right of search input */}
          <div className="hidden md:flex items-center gap-3 ml-auto">
            <button
              onClick={onFilter}
              className="text-gray-600 hover:text-black transition"
            >
              <Filter className="w-5 h-5" />
            </button>
            <button
              onClick={onSort}
              className="text-gray-600 hover:text-black transition"
            >
              <SlidersHorizontal className="w-5 h-5" />
            </button>
            <button
              onClick={onView}
              className="text-gray-600 hover:text-black transition"
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Mobile: full buttons with text */}
        <div className="flex gap-2 justify-between md:hidden">
          <button
            onClick={onFilter}
            className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-gray-700 text-sm font-medium shadow-sm w-full"
          >
            <Filter className="w-4 h-4" />
            <span>Filter</span>
          </button>
          <button
            onClick={onSort}
            className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-gray-700 text-sm font-medium shadow-sm w-full"
          >
            <SlidersHorizontal className="w-4 h-4" />
            <span>Sort</span>
          </button>
          <button
            onClick={onView}
            className="flex items-center gap-2 px-3 py-2 border rounded-md bg-white text-gray-700 text-sm font-medium shadow-sm w-full"
          >
            <List className="w-4 h-4" />
            <span>View</span>
          </button>
        </div>
      </div>
    </div>
  );
}
export default RecipeSearchBar;
