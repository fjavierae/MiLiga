import { Response, type Player } from "@/types";

export type CreatePlayerInput = Pick<Player, "name" | "positionCode" | "teamId">;

export type UpdatePlayerInput = Pick<Player, "id" | "name" | "positionCode">;

export function validateGetPlayersByTeam(teamId: number): Response<{ teamId: number }> {
	if (!Number.isInteger(teamId) || teamId <= 0) {
		return new Response<{ teamId: number }>(null, "Invalid team id.");
	}

	return new Response<{ teamId: number }>({ teamId }, null);
}

export function validateCreatePlayer(input: CreatePlayerInput): Response<CreatePlayerInput> {
	if (!input.name.trim()) {
		return new Response<CreatePlayerInput>(null, "Player name is required.");
	}

	if (!input.positionCode.trim()) {
		return new Response<CreatePlayerInput>(null, "Position code is required.");
	}

	if (!Number.isInteger(input.teamId) || input.teamId <= 0) {
		return new Response<CreatePlayerInput>(null, "Invalid team id.");
	}

	return new Response<CreatePlayerInput>(input, null);
}

export function validateUpdatePlayer(input: UpdatePlayerInput): Response<UpdatePlayerInput> {
	if (!Number.isInteger(input.id) || input.id <= 0) {
		return new Response<UpdatePlayerInput>(null, "Invalid player id.");
	}

	if (!input.name.trim()) {
		return new Response<UpdatePlayerInput>(null, "Player name is required.");
	}

	if (!input.positionCode.trim()) {
		return new Response<UpdatePlayerInput>(null, "Position code is required.");
	}

	return new Response<UpdatePlayerInput>(input, null);
}