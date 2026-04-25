"use server";

import { encryptSession } from "@/lib/auth"
import { registerPendingPlayer } from "./repository"
import { mapRegisterPlayerError } from "./errors"
import { validateLoginPlayer, validateRegisterPlayer } from "./validation"
import { UserRole,Response } from "@/types"
import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import bcrypt from "bcrypt"


/**
 * Public registration is reserved for players only.
 * Managers must be created by an administrator.
 * @param {FormData} formData - The registration form data containing 'fullName', 'email', 'password', and 'teamId'.
 * @returns {Promise<{error: string} | {success: string}>} Returns an error object if validation or registration fails, otherwise returns a success message.
 */
export async function registerPlayerAction(formData: FormData): Promise<Response<string>> {
  const response = validateRegisterPlayer(formData);
  if(response.isSuccess() && response.getData() !== null){
    const data = response.getData()!;
    const hashedPassword = await bcrypt.hash(data.password, 10);
    try {
      await registerPendingPlayer(data, hashedPassword);
    } catch (error: unknown) {
      return new Response<string>(null, mapRegisterPlayerError(error));
    }
    return new Response<string>("Registration submitted. The manager must approve your request in notifications.",null)
  }

  return new Response<string>(null, response.getError() ?? "An unknown error occurred.")
}

/**
 * @description Authenticates a user, verifies credentials, and establishes a secure session.
 * @param {FormData} formData - The login form data containing 'email' and 'password'.
 * @return {Promise<Response<string>>} Returns a Response object containing an error message if validation fails, or null if successful (with redirection).
 * The actual redirection happens within the function after setting the session cookie.
 */
export async function loginAction(formData: FormData): Promise<Response<string>> {
  const response = await validateLoginPlayer(formData);
  if (!response.isSuccess()) {
    return new Response<string>(null, response.getError() ?? "An unknown error occurred.");
  }
  const user = response.getData()!;
  
  const sessionDuration = 2 * 60 * 60 * 1000; // 2 hours in milliseconds
  const expires = new Date(Date.now() + sessionDuration);

  const sessionToken = await encryptSession({
    id: user.id,
    role: user.role,
    email: user.email,
  });

  const cookieStore = await cookies();

  cookieStore.set("session", sessionToken, {
    expires,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
  });

  if (user.role === UserRole.ADMIN) {
    redirect("/admin/dashboard");
  }

  if (user.role === UserRole.MANAGER) {
    redirect("/manager/team");
  }

  redirect("/player/dashboard");
}
