// src/pages/VerifyCode.tsx

import { useState } from "react"
import { useNavigate } from "@tanstack/react-router"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import BrandPanel from "@/components/layout/BrandPanel"
import { api } from "@/lib/api"

const VerifyCode = () => {
  const [code, setCode] = useState("")
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleVerify = async () => {
  setError("") // reset any old error

  const email = localStorage.getItem("pendingVerificationEmail")

  if (!email) {
    setError("Missing email. Please sign up again.")
    return
  }

  try {
    const res = await api.post("/api/auth/signup/verify", {
      email,
      code,
    })

    // Save verified user
    localStorage.setItem(
      "user",
      JSON.stringify({
        name: res.name || "New User",
        email,
        initials: email.charAt(0).toUpperCase(),
      })
    )
    localStorage.removeItem("pendingVerificationEmail") // clear pending email
    navigate({ to: "/" })
  } catch (err: any) {
    setError(err.message || "Verification failed. Please try again.")
  }
}

  return (
    <div className="min-h-screen flex">
      <BrandPanel />
      <div className="flex flex-1 justify-center items-center p-8">
        <div className="w-full max-w-md space-y-6">
          <div className="mb-6 text-center">
            <h2 className="text-2xl font-semibold text-gray-800">Enter Verification Code</h2>
            <p className="text-sm text-gray-500">
              We sent a 6-digit code to <span className="font-medium">{localStorage.getItem("pendingVerificationEmail")}</span>.
            </p>
          </div>

          <Input
            type="text"
            maxLength={6}
            placeholder="Enter code"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            className="text-center tracking-widest"
          />

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}

          <Button className="w-full bg-orange-500 hover:bg-orange-600 text-white" onClick={handleVerify}>
            Verify
          </Button>

          <p className="text-sm text-gray-500 text-center">
            Didn't receive a code? <button className="text-orange-500 hover:underline">Resend</button>
          </p>
        </div>
      </div>
    </div>
  )
}

export default VerifyCode