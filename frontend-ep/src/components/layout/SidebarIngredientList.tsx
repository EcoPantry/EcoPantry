import { ScrollArea } from "@/components/ui/scroll-area"

interface Ingredient {
  name: string
  quantity: number
  unit: string
}

interface SidebarIngredientListProps {
  ingredients: Ingredient[]
}

const SidebarIngredientList: React.FC<SidebarIngredientListProps> = ({ ingredients }) => {
  return (
    <ScrollArea className="h-[320px] pr-2 mb-4">
      {ingredients.map((ingredient, i) => (
        <div
          key={i}
          className="flex justify-between py-1 border-b border-orange-300"
        >
          <span className="font-medium">{ingredient.name}</span>
          <span className="text-sm text-white/80">
            {ingredient.quantity}
            {ingredient.unit}
          </span>
        </div>
      ))}
    </ScrollArea>
  )
}

export default SidebarIngredientList