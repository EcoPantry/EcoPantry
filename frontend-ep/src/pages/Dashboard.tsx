import { useMemo, useState } from "react";
import RecipeCard from "@/components/layout/RecipeCard";
import RecipeSearchBar from "@/components/layout/RecipeSearchBar";
import { Link } from "@tanstack/react-router";

const allRecipes = [
  {
    title: "Spaghetti Aglio e Olio",
    source: "pastaheaven.io",
    imageUrl: "./images/aglio-olio.jpg",
    rating: 8.3,
    price: "3.20 SGD",
  },
  {
    title: "Classic Chicken Rice",
    source: "hawkerheroes.sg",
    imageUrl: "./images/chicken-rice.jpg",
    rating: 9.1,
    price: "4.50 SGD",
  },
  {
    title: "Grilled Tofu Banh Mi",
    source: "veggiedelight.net",
    imageUrl: "./images/banh-mi.jpg",
    rating: 7.8,
    price: "5.00 SGD",
  },
  {
    title: "Japanese Curry Rice",
    source: "tokyotable.jp",
    imageUrl: "./images/japanese-curry.jpg",
    rating: 8.6,
    price: "6.80 SGD",
  },
  {
    title: "Beef Bulgogi Bowl",
    source: "koreankitchen.kr",
    imageUrl: "./images/bulgogi-bowl.jpg",
    rating: 8.9,
    price: "7.20 SGD",
  },
  {
    title: "Vegetable Bibimbap",
    source: "plantplate.org",
    imageUrl: "./images/bibimbap.jpg",
    rating: 7.5,
    price: "5.70 SGD",
  },
  {
    title: "Pesto Zoodle Bowl",
    source: "lowcarblife.com",
    imageUrl: "./images/pesto-zoodles.jpg",
    rating: 7.0,
    price: "6.30 SGD",
  },
  {
    title: "Tom Yum Soup with Rice",
    source: "thaiflare.co",
    imageUrl: "./images/tomyum.jpg",
    rating: 8.4,
    price: "5.90 SGD",
  },
  {
    title: "Grilled Salmon with Quinoa",
    source: "omegafoods.com",
    imageUrl: "./images/salmon-quinoa.jpg",
    rating: 9.2,
    price: "9.80 SGD",
  },
  {
    title: "Avocado Toast with Egg",
    source: "brunchdaily.io",
    imageUrl: "./images/avocado-toast.jpg",
    rating: 7.9,
    price: "4.90 SGD",
  }
];

const Dashboard = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc" | null>(null);

  // Handlers
  const handleSearch = (value: string) => {
    setSearchQuery(value.toLowerCase());
  };

  const handleSort = () => {
    setSortOrder((prev) =>
      prev === "asc" ? "desc" : prev === "desc" ? null : "asc"
    );
  };

  // Filtered and sorted recipes
  const visibleRecipes = useMemo(() => {
    let filtered = allRecipes.filter((r) =>
      r.title.toLowerCase().includes(searchQuery)
    );

    if (sortOrder === "asc") {
      filtered.sort((a, b) => a.rating - b.rating);
    } else if (sortOrder === "desc") {
      filtered.sort((a, b) => b.rating - a.rating);
    }

    return filtered;
  }, [searchQuery, sortOrder]);
  
  return (
    <div className="p-6">
      <Link to="/" className="flex items-center justify-between mb-4 hover:opacity-80 transition">
        <h1 className="text-2xl font-bold">EcoPantry</h1>
      </Link>

      <div className="max-w-[1040px] mx-auto">
        <RecipeSearchBar
          onSearch={handleSearch}
          onSort={handleSort}
          onFilter={() => console.log("filter")}
          onView={() => console.log("view")}
        />

        <div
          className="grid gap-6 justify-center"
          style={{
            gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
            maxWidth: "1024px",
            margin: "0 auto",
          }}
        >
          {visibleRecipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
