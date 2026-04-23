/**
 * @module DataActions
 * @description Provides standardized CRUD (Create, Read, Update, Delete) operations 
 * for the core entities of the league management system.
 */
"use server";

import { query } from "../../lib/db";
import type { Team} from "../../types";

/**
 * Fetches all teams associated with a specific league.
 * @param {number} leagueId - Foreign key reference to the league.
 */
export async function getTeamsByLeague(leagueId: number): Promise<Team[]> {
  const result = await query<Team>(
    `SELECT 
      id, 
      league_id AS "leagueId", 
      name, 
      logo, 
      initials 
    FROM teams 
    WHERE league_id = $1 
    ORDER BY name ASC`,
    [leagueId]
  );
  return result.rows;
}

/**
 * Permanently removes a team from the system.
 * @param {number} id - The unique identifier of the team.
 */
export async function deleteTeam(id: number): Promise<void> {
  await query("DELETE FROM teams WHERE id = $1", [id]);
}

/**
 * Creates a new team within a specific league.
 * * @param {Omit<Team, "id">} teamData - The team object without the auto-generated ID.
 * @returns {Promise<Team>} The newly created team record.
 */
export async function createTeam(teamData: Omit<Team, "id">): Promise<Team> {
  const { 
    leagueId, name, logo, mainColor, secondaryColor, defaultPlayerImage, initials 
  } = teamData;

  const result = await query<Team>(
    `INSERT INTO teams (
      league_id, 
      name, 
      logo, 
      main_color, 
      secondary_color, 
      default_player_image, 
      initials
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7) 
    RETURNING 
      id, 
      league_id AS "leagueId", 
      name, 
      logo, 
      main_color AS "mainColor", 
      secondary_color AS "secondaryColor", 
      default_player_image AS "defaultPlayerImage", 
      initials`,
    [leagueId, name, logo, mainColor, secondaryColor, defaultPlayerImage, initials]
  );
  
  return result.rows[0];
}