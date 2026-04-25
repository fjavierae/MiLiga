"use server";

import { createLeague as createLeagueRepository, getLeagues as getLeaguesRepository } from "./repository";
import type { League } from "@/types";
import { validateCreateLeague } from "./validation";
import { mapCreateLeagueError } from "./errors";

export async function getLeagues(): Promise<League[]> {
	return getLeaguesRepository();
}

export async function createLeague(name: string): Promise<League> {
	const validation = validateCreateLeague(name);

	if (!validation.isSuccess()) {
		throw new Error(validation.getError() ?? "League name is required.");
	}

	const input = validation.getData();

	if (!input) {
		throw new Error("League name is required.");
	}

	try {
		return await createLeagueRepository(input.name);
	} catch (error) {
		throw new Error(mapCreateLeagueError(error));
	}
}