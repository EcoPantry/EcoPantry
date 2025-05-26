import { Pencil } from "lucide-react"
import { Input } from "@/components/ui/input"

const IngredientInput = () => {
  return (
    <div className="relative">
      <Pencil className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={16} />
      <Input
        placeholder="Enter ingredients"
        className="pl-8 bg-white text-black shadow-sm border border-gray-300 rounded-md"
      />
    </div>
  )
}

export default IngredientInput
