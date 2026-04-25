import { Response, type Match } from "@/types";

export type CreateMatchInput = Omit<Match, "id">;

export function validateGetMatchesByLeague(leagueId: number): Response<{ leagueId: number }> {
	if (!Number.isInteger(leagueId) || leagueId <= 0) {
		return new Response<{ leagueId: number }>(null, "Invalid league id.");
	}

	return new Response<{ leagueId: number }>({ leagueId }, null);
}

export function validateCreateMatch(matchData: CreateMatchInput): Response<CreateMatchInput> {
	if (!Number.isInteger(matchData.leagueId) || matchData.leagueId <= 0) {
		return new Response<CreateMatchInput>(null, "Invalid league id.");
	}

	if (!Number.isInteger(matchData.localTeamId) || matchData.localTeamId <= 0) {
		return new Response<CreateMatchInput>(null, "Invalid local team id.");
	}

	if (!Number.isInteger(matchData.visitorTeamId) || matchData.visitorTeamId <= 0) {
		return new Response<CreateMatchInput>(null, "Invalid visitor team id.");
	}

	if (!matchData.date || !matchData.time) {
		return new Response<CreateMatchInput>(null, "Date and time are required.");
	}

	return new Response<CreateMatchInput>(matchData, null);
}