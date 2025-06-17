// src/components/auth/SignupForm.tsx
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useReducer } from "react";
import { useNavigate } from "@tanstack/react-router";
import { api } from "@/lib/api";

type State = {
  email: string;
  password: string;
  confirmPassword: string;
  error: string;
  submitting: boolean;
  success: boolean;
};

type Action =
  | { type: "SET_EMAIL"; payload: string }
  | { type: "SET_PASSWORD"; payload: string }
  | { type: "SET_CONFIRM_PASSWORD"; payload: string }
  | { type: "SET_ERROR"; payload: string }
  | { type: "SET_SUBMITTING"; payload: boolean }
  | { type: "SET_SUCCESS"; payload: boolean };

const initialState: State = {
  email: "",
  password: "",
  confirmPassword: "",
  error: "",
  submitting: false,
  success: false,
};

interface SignupFormProps {
  onSuccess?: () => void;
}

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_EMAIL":
      return { ...state, email: action.payload };
    case "SET_PASSWORD":
      return { ...state, password: action.payload };
    case "SET_CONFIRM_PASSWORD":
      return { ...state, confirmPassword: action.payload };
    case "SET_ERROR":
      return { ...state, error: action.payload };
    case "SET_SUBMITTING":
      return { ...state, submitting: action.payload };
    case "SET_SUCCESS":
      return { ...state, success: action.payload };
    default:
      return state;
  }
}

const SignupForm = ({ onSuccess }: SignupFormProps) => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: "SET_ERROR", payload: "" });

    // Basic validation
    if (!state.email.includes("@")) {
      dispatch({ type: "SET_ERROR", payload: "Please enter a valid email." });
      return;
    }
    if (state.password.length < 6) {
      dispatch({
        type: "SET_ERROR",
        payload: "Password must be at least 6 characters.",
      });
      return;
    }
    if (state.password !== state.confirmPassword) {
      dispatch({ type: "SET_ERROR", payload: "Passwords do not match." });
      return;
    }

    dispatch({ type: "SET_SUBMITTING", payload: true });

    // Signup API call
    try {
      const res = await api.post("/api/auth/signup/initiate", {
        email: state.email,
        password: state.password,
      });

      // You can check res for more info if needed

      dispatch({ type: "SET_SUCCESS", payload: true });
      dispatch({ type: "SET_SUBMITTING", payload: false });

      localStorage.setItem("pendingVerificationEmail", state.email);

      setTimeout(() => {
        if (onSuccess) {
          onSuccess();
        } else {
          navigate({ to: "/verify-code" });
        }
      }, 1000);
    } catch (err: any) {
      dispatch({ type: "SET_ERROR", payload: err.message || "Signup failed" });
      dispatch({ type: "SET_SUBMITTING", payload: false });
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <Input
          type="email"
          placeholder="you@example.com"
          required
          value={state.email}
          onChange={(e) =>
            dispatch({ type: "SET_EMAIL", payload: e.target.value })
          }
          disabled={state.submitting || state.success}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <Input
          type="password"
          placeholder="••••••••"
          required
          value={state.password}
          onChange={(e) =>
            dispatch({ type: "SET_PASSWORD", payload: e.target.value })
          }
          disabled={state.submitting || state.success}
        />
      </div>
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <Input
          type="password"
          placeholder="••••••••"
          required
          value={state.confirmPassword}
          onChange={(e) =>
            dispatch({ type: "SET_CONFIRM_PASSWORD", payload: e.target.value })
          }
          disabled={state.submitting || state.success}
        />
      </div>

      {state.error && <p className="text-sm text-red-500">{state.error}</p>}
      {state.success && (
        <p className="text-sm text-green-600">
          Account created! Redirecting to sign in…
        </p>
      )}

      <Button
        type="submit"
        className="w-full bg-orange-500 hover:bg-orange-600 text-white"
        disabled={state.submitting || state.success}
      >
        {state.submitting ? "Signing up…" : "Sign Up"}
      </Button>
    </form>
  );
};

export default SignupForm;
