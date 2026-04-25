"use server";

import type { Player } from "@/types";
import {
  createPlayer as createPlayerRepository,
  getPlayersByTeam as getPlayersByTeamRepository,
  updatePlayer as updatePlayerRepository,
} from "./repository";
import {
  validateCreatePlayer,
  validateGetPlayersByTeam,
  validateUpdatePlayer,
} from "./validation";
import { mapPlayerDbError } from "./errors";

export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
  const validation = validateGetPlayersByTeam(teamId);

  if (!validation.isSuccess()) {
    throw new Error(validation.getError() ?? "Invalid team id.");
  }

  const input = validation.getData();

  if (!input) {
    throw new Error("Invalid team id.");
  }

  return getPlayersByTeamRepository(input.teamId);
}

export async function updatePlayer(id: number, name: string, positionCode: string): Promise<Player> {
  const validation = validateUpdatePlayer({ id, name, positionCode });

  if (!validation.isSuccess()) {
    throw new Error(validation.getError() ?? "Invalid player data.");
  }

  const input = validation.getData();

  if (!input) {
    throw new Error("Invalid player data.");
  }

  try {
    return await updatePlayerRepository(input.id, input.name, input.positionCode);
  } catch (error) {
    throw new Error(mapPlayerDbError(error));
  }
}

export async function createPlayer(name: string, positionCode: string, teamId: number): Promise<Player> {
  const validation = validateCreatePlayer({ name, positionCode, teamId });

  if (!validation.isSuccess()) {
    throw new Error(validation.getError() ?? "Invalid player data.");
  }

  const input = validation.getData();

  if (!input) {
    throw new Error("Invalid player data.");
  }

  try {
    return await createPlayerRepository(input.name, input.positionCode, input.teamId);
  } catch (error) {
    throw new Error(mapPlayerDbError(error));
  }
}