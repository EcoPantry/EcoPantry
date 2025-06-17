import BrandPanel from "@/components/layout/BrandPanel"
import SignupForm from "@/components/auth/SignupForm"
import { useNavigate } from "@tanstack/react-router"


const SignUp = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen flex">
      <BrandPanel />
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-gray-800">Create an account</h2>
            <p className="text-sm text-gray-500">Start managing your pantry effortlessly.</p>
          </div>
          <SignupForm onSuccess={() => navigate({ to: "/verify-code" })} />
          <p className="text-sm text-gray-500 text-center">
            Already have an account? <a href="/sign-in" className="text-orange-500 hover:underline">Sign in</a>
          </p>
        </div>
      </div>
    </div>
  )
}
export default SignUp