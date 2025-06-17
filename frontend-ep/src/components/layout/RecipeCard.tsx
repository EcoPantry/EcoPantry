import { Star, DollarSign } from "lucide-react";
import { Link } from "@tanstack/react-router";

interface RecipeCardProps {
  title: string;
  source: string;
  imageUrl: string;
  rating: number;
  price: string;
}

const RecipeCard = ({
  title,
  source = "dummy-source",
  imageUrl,
  rating,
  price,
}: RecipeCardProps) => {
  return (
    <Link to={`/recipe/${source}`} className="block">
      <div className="w-[320px] bg-white rounded-lg shadow-sm overflow-hidden border mx-auto">
        <img src={imageUrl} alt={title} className="w-full h-52 object-cover" />
        <div className="p-5 space-y-2">
          <h3 className="text-lg font-semibold leading-tight">{title}</h3>
          <p className="text-sm text-gray-500 italic">{source}</p>

          <div className="flex flex-col text-sm text-gray-600 space-y-1 mt-2">
            <div className="flex items-center gap-1">
              <Star className="w-4 h-4 fill-yellow-400 stroke-yellow-400" />
              <span>{rating.toFixed(1)}/10</span>
            </div>
            <div className="flex items-center gap-1">
              <DollarSign className="w-4 h-4 stroke-gray-500" />
              <span className="whitespace-nowrap">{price}/serving</span>
            </div>
          </div>
        </div>
      </div>
    </Link>
  );
};

export default RecipeCard;
