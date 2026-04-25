import { Response, type Team } from "@/types";

export type CreateTeamInput = Omit<Team, "id">;

export function validateGetTeamsByLeague(leagueId: number): Response<{ leagueId: number }> {
	if (!Number.isInteger(leagueId) || leagueId <= 0) {
		return new Response<{ leagueId: number }>(null, "Invalid league id.");
	}

	return new Response<{ leagueId: number }>({ leagueId }, null);
}

export function validateCreateTeam(teamData: CreateTeamInput): Response<CreateTeamInput> {
	if (!Number.isInteger(teamData.leagueId) || teamData.leagueId <= 0) {
		return new Response<CreateTeamInput>(null, "Invalid league id.");
	}

	if (!teamData.name.trim()) {
		return new Response<CreateTeamInput>(null, "Team name is required.");
	}

	if (!teamData.initials.trim()) {
		return new Response<CreateTeamInput>(null, "Team initials are required.");
	}

	return new Response<CreateTeamInput>(teamData, null);
}

export function validateDeleteTeam(id: number): Response<{ id: number }> {
	if (!Number.isInteger(id) || id <= 0) {
		return new Response<{ id: number }>(null, "Invalid team id.");
	}

	return new Response<{ id: number }>({ id }, null);
}