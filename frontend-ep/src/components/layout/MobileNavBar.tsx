// src/components/layout/MobileNavBar.tsx
import { Link, useRouterState } from "@tanstack/react-router"
import { Fish, Search, User } from "lucide-react"
import { cn } from "@/lib/utils"

const tabs = [
  { to: "/", label: "Ingredients", icon: Fish },
  { to: "/pantry", label: "Search Recipes", icon: Search },
  { to: "/profile", label: "Profile", icon: User },
]

const MobileNavBar = () => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })

  return (
    <nav className="fixed bottom-0 left-0 right-0 border-t border-gray-200 bg-white z-50 md:hidden flex">
      {tabs.map(({ to, label, icon: Icon }) => {
        const isActive = pathname === to
        return (
          <Link
            key={to}
            to={to}
            className={cn(
              "flex flex-1 flex-col items-center justify-center gap-1 py-2 border-r border-dashed border-purple-400",
              isActive ? "bg-orange-500 text-white" : "text-black"
            )}
          >
            <Icon className={cn("h-5 w-5", isActive ? "text-white" : "text-black")} />
            <span className="text-xs">{label}</span>
          </Link>
        )
      })}
    </nav>
  )
}
export default MobileNavBar