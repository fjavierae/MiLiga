export function mapTeamDbError(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23503"
	) {
		return "The referenced league does not exist or the team is still in use.";
	}

	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23505"
	) {
		return "A team with that name or initials already exists.";
	}

	return "Failed to process team data.";
}