import BrandPanel from "@/components/layout/BrandPanel"
import LoginForm from "@/components/auth/LoginForm"
import { useNavigate } from "@tanstack/react-router"

const SignIn = () => {
  const navigate = useNavigate()

  const handleGuestAccess = () => {
    // Set mock user info (optional)
    localStorage.setItem("user", JSON.stringify({
      name: "Guest",
      email: "guest@ecopantry.com",
      initials: "G",
    }))
    navigate({ to: "/" }) // redirect to dashboard
  }

  return (
    <div className="min-h-screen flex">
      <BrandPanel />
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Sign in to EcoPantry</h2>
            <p className="text-sm text-gray-500">Welcome back! Please enter your details.</p>
          </div>

          <LoginForm />

          <div className="text-center space-y-2">
            <p className="text-sm text-gray-500">
              Don’t have an account? <a href="/sign-up" className="text-orange-500 hover:underline">Sign up</a>
            </p>
            <button
              onClick={handleGuestAccess}
              className="text-sm text-gray-600 hover:text-orange-500 underline transition"
            >
              Continue as guest
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default SignIn
