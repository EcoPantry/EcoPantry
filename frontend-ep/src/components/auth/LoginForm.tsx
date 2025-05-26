// src/components/auth/LoginForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/context/UserProvider";
import { useNavigate } from "@tanstack/react-router";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser()
  const navigate = useNavigate()

  //   const handleSubmit = async (e: React.FormEvent) => {
  //     e.preventDefault()
  //     // TODO: call your login API here
  //     const res = await fetch("/api/sign-in", {
  //       method: "POST",
  //       headers: { "Content-Type": "application/json" },
  //       credentials: "include",
  //       body: JSON.stringify({ email, password }),
  //     })
  //     if (res.ok) {
  //       // success logic (e.g. redirect)
  //     } else {
  //       // error handling
  //     }
  //   }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    const fakeUser = {
      name: "Joe Mama",
      email,
      initials: email.charAt(0).toUpperCase() + email.charAt(1).toUpperCase(),
    }

    setUser(fakeUser)
    // Optional: redirect with router
    navigate({ to: "/" })
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Email
        </label>
        <Input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Password
        </label>
        <Input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          placeholder="••••••••"
          required
        />
      </div>
      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
      >
        Sign In
      </Button>
    </form>
  );
};

export default LoginForm;
