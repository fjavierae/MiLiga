export function mapCreateLeagueError(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23505"
	) {
		return "A league with that name already exists.";
	}

	return "Failed to create league.";
}