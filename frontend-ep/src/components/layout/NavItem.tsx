import { Link, useRouterState } from "@tanstack/react-router"

const NavItem = ({ to, label }: { to: string; label: string }) => {
  const pathname = useRouterState({ select: (s) => s.location.pathname })
  const isActive = pathname === to

  return (
    <Link
      to={to}
      className={`px-4 py-2 rounded-md text-sm font-medium ${
        isActive ? "bg-orange-700" : "hover:bg-orange-600"
      }`}
    >
      {label}
    </Link>
  )
}
export default NavItem
