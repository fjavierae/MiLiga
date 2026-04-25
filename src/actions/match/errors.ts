export function mapCreateMatchError(error: unknown): string {
	if (
		typeof error === "object" &&
		error !== null &&
		"code" in error &&
		(error as { code?: string }).code === "23503"
	) {
		return "One of the referenced records does not exist.";
	}

	return "Failed to create match.";
}