/**
 * @module AuthUtilities
 * @description Core security utilities for JWT encryption and session validation.
 * Utilizes 'jose' for lightweight, Edge-compatible cryptography.
 */

import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SECRET_KEY = new TextEncoder().encode(
  process.env.JWT_SECRET
);

/**
 * Encrypts user data into a secure JWT.
 * @param {any} payload - Data to include in the token (e.g., id, role, email).
 * @returns {Promise<string>} The signed JWT.
 */
export async function encryptSession(payload: any): Promise<string> {
  return await new SignJWT(payload)
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("2h")
    .sign(SECRET_KEY);
}

/**
 * Decrypts and verifies the session from the 'session' cookie.
 * * @important In Next.js 15+, 'cookies()' is asynchronous.
 * @returns {Promise<any | null>} The decrypted user payload or null if invalid/missing.
 */
export async function getSession() {
  const cookieStore = await cookies();
  const sessionToken = cookieStore.get("session")?.value;

  if (!sessionToken) return null;

  try {
    const { payload } = await jwtVerify(sessionToken, SECRET_KEY, {
      algorithms: ["HS256"],
    });
    return payload;
  } catch  {
    return null;
  }
}