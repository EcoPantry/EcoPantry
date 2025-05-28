import RecipeCard from "@/components/layout/RecipeCard";
import RecipeSearchBar from "@/components/layout/RecipeSearchBar";
import { Link } from "@tanstack/react-router";

const recipes = [
  {
    title: "Poke Salad Bowl",
    source: "fineeats.com",
    imageUrl: "./images/poke-bowl.png",
    rating: 6.7,
    price: "2.60 SGD",
  },
  {
    title: "Poke Salad Bowl 2",
    source: "fineeats.com",
    imageUrl: "./images/poke-bowl.png",
    rating: 6.9,
    price: "8.60 SGD",
  },
  {
    title: "Poke Salad Bowl 2",
    source: "fineeats.com",
    imageUrl: "./images/poke-bowl.png",
    rating: 6.9,
    price: "8.60 SGD",
  },
  {
    title: "Poke Salad Bowl 2",
    source: "fineeats.com",
    imageUrl: "./images/poke-bowl.png",
    rating: 6.9,
    price: "8.60 SGD",
  },
];

const Dashboard = () => {
  return (
    <div className="p-6">
      <Link
        to="/"
        className="flex items-center justify-between mb-4 hover:opacity-80 transition"
      >
        <h1 className="text-2xl font-bold">EcoPantry</h1>
      </Link>
      <div className="max-w-[1040px] mx-auto">
        <RecipeSearchBar
          onSearch={(value) => console.log("search:", value)}
          onFilter={() => console.log("filter")}
          onSort={() => console.log("sort")}
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
          {recipes.map((recipe, index) => (
            <RecipeCard key={index} {...recipe} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
