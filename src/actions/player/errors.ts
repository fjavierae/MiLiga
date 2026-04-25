export function mapPlayerDbError(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23505"
	) {
		return "A player with the same unique data already exists.";
	}

	return "Failed to process player data.";
}