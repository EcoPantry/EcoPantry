import { ScrollArea } from "@/components/ui/scroll-area";

interface IngredientListProps {
  ingredients: Ingredients[];
}

interface Ingredients {
  name: string;
  quantity: string;
}

const IngredientListSidebar = ({ ingredients }:IngredientListProps) => {
	return (
		<ScrollArea className="h-[320px] pr-2 mb-4">
			<div className="flex flex-col gap-2">
				{ingredients.map((item, index) => (
					<div key={index} className="p-2 bg-white rounded shadow hover:bg-gray-100 transition">
						<span className="text-gray-900 font-semibold">{item.name}</span>
						<span className="text-gray-500 ml-2">{item.quantity}</span>
					</div>
				))}
			</div>
		</ScrollArea>
	);
}

export default IngredientListSidebar;

