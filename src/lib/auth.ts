// src/lib/auth.ts

import jwt from "jsonwebtoken";
import { cookies } from "next/headers";

const SECRET = process.env.JWT_SECRET || "dev-secret-change-me";

export interface JWTPayload {
  id: string;
  email: string;
  role: "ADMIN" | "CUSTOMER";
}

/** Sign a JWT token (server-side) */
export function signToken(payload: JWTPayload): string {
  return jwt.sign(payload, SECRET, { expiresIn: "7d" });
}

/** Verify and decode a JWT token */
export function verifyToken(token: string): JWTPayload | null {
  try {
    return jwt.verify(token, SECRET) as JWTPayload;
  } catch {
    return null;
  }
}

/** Get the current user from the request cookie (Server Components / Route Handlers) */
export function getCurrentUser(): JWTPayload | null {
  const cookieStore = cookies();
  const token = cookieStore.get("auth_token")?.value;
  if (!token) return null;
  return verifyToken(token);
}

/** Middleware helper: returns true if the caller is an ADMIN */
export function isAdmin(): boolean {
  const user = getCurrentUser();
  return user?.role === "ADMIN";
}
