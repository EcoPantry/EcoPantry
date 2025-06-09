import type { Request, Response } from "express";
import * as AuthService from "../services/auth.service";

export const signupInitiate = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const result = await AuthService.signupInitiate(email, password);
    res.status(200).json(result);
  } catch (err) {
    if (err instanceof Error) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(500).json({ error: "Unknown error occurred" });
    }
  }
};

export const signupVerify = async (req: Request, res: Response) => {
  try {
    const { email, code } = req.body;
    const result = await AuthService.signupVerify(email, code);
    res.status(200).json(result);
  } catch (err) {
    console.error("Verification failed:", err);
    if (err instanceof Error) {
      res.status(400).json({ error: err.message });
    } else {
      res.status(400).json({ error: "Unknown verification error" });
    }
  }
};

export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    const { token, user } = await AuthService.login(email, password);

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 1000 * 60 * 60, // 1 hour
    });

    res.status(200).json({
      message: "Logged in",
      user,
    });
  } catch (err) {
    if (err instanceof Error) {
      res.status(401).json({ error: err.message });
    } else {
      res.status(401).json({ error: "Unknown login error" });
    }
  }
};

export const logout = async (_req: Request, res: Response) => {
  // Placeholder logic – session/token clearing would go here
  res.status(200).json({ message: "Logged out successfully" });
};
