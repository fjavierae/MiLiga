/**
 * Functions to map specific error cases to user-friendly messages for the registration process.
 * This helps maintain a clean separation of concerns and keeps the main action logic focused on flow control.
 * @module AuthErrorMapping
 * @description Maps backend error responses to user-friendly messages for registration and login actions.
 * This module centralizes error handling logic, making it easier to maintain and update error messages in one place.
 * @param error 
 * @returns 
 */
export function mapRegisterPlayerError(error: unknown): string {
	if (error instanceof Error && error.message === "TEAM_NOT_FOUND") {
		return "The selected team does not exist.";
	}

	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23505"
	) {
		return "That email is already registered.";
	}

	return "Failed to complete registration.";
}