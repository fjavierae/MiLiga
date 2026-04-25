"use server";

import type { Team } from "@/types";
import {
  createTeam as createTeamRepository,
  deleteTeam as deleteTeamRepository,
  getTeamsByLeague as getTeamsByLeagueRepository,
} from "./repository";
import { mapTeamDbError } from "./errors";
import {
  validateCreateTeam,
  validateDeleteTeam,
  validateGetTeamsByLeague,
} from "./validation";

export async function getTeamsByLeague(leagueId: number): Promise<Team[]> {
  const validation = validateGetTeamsByLeague(leagueId);

  if (!validation.isSuccess()) {
    throw new Error(validation.getError() ?? "Invalid league id.");
  }

  const input = validation.getData();

  if (!input) {
    throw new Error("Invalid league id.");
  }

  return getTeamsByLeagueRepository(input.leagueId);
}

export async function deleteTeam(id: number): Promise<void> {
  const validation = validateDeleteTeam(id);

  if (!validation.isSuccess()) {
    throw new Error(validation.getError() ?? "Invalid team id.");
  }

  const input = validation.getData();

  if (!input) {
    throw new Error("Invalid team id.");
  }

  try {
    await deleteTeamRepository(input.id);
  } catch (error) {
    throw new Error(mapTeamDbError(error));
  }
}

export async function createTeam(teamData: Omit<Team, "id">): Promise<Team> {
  const validation = validateCreateTeam(teamData);

  if (!validation.isSuccess()) {
    throw new Error(validation.getError() ?? "Invalid team data.");
  }

  const input = validation.getData();

  if (!input) {
    throw new Error("Invalid team data.");
  }

  try {
    return await createTeamRepository(input);
  } catch (error) {
    throw new Error(mapTeamDbError(error));
  }
}