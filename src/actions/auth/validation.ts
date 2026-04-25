import { findUserByEmail } from "./repository";
import bcrypt from "bcrypt";
import { UserRole, UserStatus, Response } from "@/types";

const getFormString = (formData: FormData, fieldName: string): string => {
	const value = formData.get(fieldName);
	return typeof value === "string" ? value.trim() : "";
};

export interface RegisterPlayerInput {
	fullName: string;
	email: string;
	password: string;
	teamId: number;
}

export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  teamId?: number;
  playerId?: number;
}


export function validateRegisterPlayer(
	formData: FormData
): Response<RegisterPlayerInput>{
	const fullName = getFormString(formData, "fullName")
	const email = getFormString(formData, "email")
	const password = getFormString(formData, "password")
	const teamIdValue = getFormString(formData, "teamId")
	const teamId = Number(teamIdValue)

	if (!fullName) {
        return new Response<RegisterPlayerInput>(null, "Full name is required.")
	}

	if (!email || !password) {
        return new Response<RegisterPlayerInput>(null, "Email and password are required.")
	}

	if (!Number.isInteger(teamId) || teamId <= 0) {
        return new Response<RegisterPlayerInput>(null, "A valid team must be selected.")
	}

	return new Response<RegisterPlayerInput>({
		fullName,
		email,
		password,
		teamId,
		},
	null)
}

export async function validateLoginPlayer(
	formData: FormData
): Promise<Response<User>> {
	const email = getFormString(formData, "email")
	const password = getFormString(formData, "password")

	if (!email || !password) {
		return new Response<User>(null, "Email and password are required.")
	}

    const user = await findUserByEmail(email)
    
    const isPasswordValid = user ? await bcrypt.compare(password, user.passwordHash) : false;
    
    if (!user || !isPasswordValid) {
        return new Response<User>(null, "Invalid email or password.")
    }
    
    if (user.role === UserRole.PLAYER && user.status !== UserStatus.ACTIVE) {
        return new Response<User>(null, "Your request is still pending. The manager must approve your request and assign you a jersey number.")
    }
	return new Response<User>(user, null)
}