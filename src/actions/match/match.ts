"use server";

import type { Match } from "@/types";
import { createMatch as createMatchRepository, getMatchesByLeague as getMatchesByLeagueRepository } from "./repository";
import { mapCreateMatchError } from "./errors";
import { validateCreateMatch, validateGetMatchesByLeague } from "./validation";

export async function getMatchesByLeague(leagueId: number): Promise<Match[]> {
	const validation = validateGetMatchesByLeague(leagueId);

	if (!validation.isSuccess()) {
		throw new Error(validation.getError() ?? "Invalid league id.");
	}

	const input = validation.getData();

	if (!input) {
		throw new Error("Invalid league id.");
	}

	return getMatchesByLeagueRepository(input.leagueId);
}

export async function createMatch(matchData: Omit<Match, "id">): Promise<Match> {
	const validation = validateCreateMatch(matchData);

	if (!validation.isSuccess()) {
		throw new Error(validation.getError() ?? "Invalid match data.");
	}

	const input = validation.getData();

	if (!input) {
		throw new Error("Invalid match data.");
	}

	try {
		return await createMatchRepository(input);
	} catch (error) {
		throw new Error(mapCreateMatchError(error));
	}
}