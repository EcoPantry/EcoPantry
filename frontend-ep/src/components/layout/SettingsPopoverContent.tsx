import { Link, useNavigate } from "@tanstack/react-router";
import { Settings, LogOut } from "lucide-react";
import { useCallback } from "react";

const SettingsPopoverContent = () => {
  const navigate = useNavigate()

  const handleLogout = useCallback(() => {
    localStorage.removeItem("token")
    navigate({ to: "/sign-in" })
  }, [navigate])

  return (
    <div className="flex flex-col text-sm">
      <Link
        to="/profile"
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full"
      >
        <Settings className="w-4 h-4 text-gray-600" />
        <span>Profile</span>
      </Link>

      <div
        onClick={handleLogout}
        className="flex items-center gap-2 px-4 py-2 hover:bg-gray-100 transition-colors w-full cursor-pointer"
      >
        <LogOut className="w-4 h-4 text-gray-600" />
        <span>Logout</span>
      </div>
    </div>
  )
}

export default SettingsPopoverContent;
