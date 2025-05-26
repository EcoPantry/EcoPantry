import { useUser } from "@/context/UserProvider"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import SettingsPopoverContent from "./SettingsPopoverContent"

const UserProfileCard = () => {
  const { user, loading } = useUser()

  if (loading) {
    return <div className="text-sm text-gray-600 p-3">Loading...</div>
  }

  if (!user) {
    return (
      <div className="bg-white text-black p-3 rounded-md text-sm text-center">
        <p className="mb-2">You're not signed in.</p>
        <a href="/sign-in" className="text-orange-500 hover:underline">Sign in</a>
      </div>
    )
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <button className="flex items-center justify-between bg-white rounded-md p-2 text-black w-full hover:bg-gray-100 transition">
          <div className="flex items-center gap-2">
            <Avatar className="w-8 h-8">
              <AvatarFallback>{user.initials || "?"}</AvatarFallback>
            </Avatar>
            <div className="text-left">
              <p className="text-sm font-medium">{user.name}</p>
              <p className="text-xs text-muted-foreground">{user.email}</p>
            </div>
          </div>
          <span className="text-xl text-gray-500">{">"}</span>
        </button>
      </PopoverTrigger>
      <PopoverContent>
        <SettingsPopoverContent />
      </PopoverContent>
    </Popover>
  )
}

export default UserProfileCard
