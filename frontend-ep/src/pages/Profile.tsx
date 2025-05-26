import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { useUser } from "@/context/UserProvider"

const Profile = () => {
  const { user } = useUser()

  return (
    <div className="max-w-xl mx-auto p-6 space-y-8">
      <div>
        <h1 className="text-2xl font-bold mb-1">Profile Settings</h1>
        <p className="text-sm text-muted-foreground mb-2">
          You can view and manage your account details here.
        </p>
        <div className="bg-white border rounded-md p-4">
          <p className="text-sm font-medium text-gray-500 mb-1">Email</p>
          <p className="text-base font-semibold text-gray-800">
            {user?.email || "Not signed in"}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Change Password</h2>

        <form
          className="space-y-4"
          onSubmit={(e) => {
            e.preventDefault()
            // TODO: add password change logic
          }}
        >
          <div className="space-y-2">
            <label className="block text-sm font-medium">Old Password</label>
            <Input type="password" placeholder="••••••" required />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">New Password</label>
            <Input type="password" placeholder="••••••" required />
          </div>

          <div className="space-y-2">
            <label className="block text-sm font-medium">Confirm New Password</label>
            <Input type="password" placeholder="••••••" required />
          </div>

          <Button
            type="submit"
            className="bg-orange-500 hover:bg-orange-600 text-white"
          >
            Change Password
          </Button>
        </form>
      </div>
    </div>
  )
}

export default Profile