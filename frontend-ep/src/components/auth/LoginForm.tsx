// src/components/auth/LoginForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useUser } from "@/context/UserProvider";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api";



const LoginForm = () => {
  const [errorMsg, setErrorMsg] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useUser();
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await api.post("/api/auth/login", {
        email,
        password,
      });

      const user = res.user;

      setUser({
        name: user.name,
        email: user.email,
        id: user.id,
        initials:
          user.name?.[0]?.toUpperCase() || email.charAt(0).toUpperCase(),
      });

      navigate({ to: "/" });
    } catch (err: any) {
      console.error("Login failed:", err);

      // Try to get specific error message from backend
      const message = err?.message || "Login failed. Check your credentials.";
      setErrorMsg(message);
    }
  };

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
      {errorMsg && (
        <p className="text-sm text-red-500 text-center">{errorMsg}</p>
      )}
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
