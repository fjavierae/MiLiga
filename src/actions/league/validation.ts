import { Response } from "@/types";

export interface CreateLeagueInput {
	name: string;
}

export function validateCreateLeague(name: string): Response<CreateLeagueInput> {
	const normalizedName = name.trim();

	if (!normalizedName) {
		return new Response<CreateLeagueInput>(null, "League name is required.");
	}

	return new Response<CreateLeagueInput>({ name: normalizedName }, null);
}