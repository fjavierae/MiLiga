
/**
 * @module DataActions
 * @description Provides standardized CRUD (Create, Read, Update, Delete) operations 
 * for the core entities of the league management system.
 */

"use server";

import { query } from "../../lib/db";
import type { Player } from "../../types";

/**
 * Retrieves the roster for a specific team.
 * @param {number} teamId - Foreign key reference to the team.
 */
export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
  const result = await query<Player>(
    `SELECT 
      id, 
      name, 
      position_code AS "positionCode", 
      team_id AS "teamId" 
    FROM players 
    WHERE team_id = $1`,
    [teamId]
  );
  return result.rows;
}

/**
 * Updates a player's profile information.
 */
export async function updatePlayer(id: number, name: string, positionCode: string): Promise<Player> {
  const result = await query<Player>(
    `UPDATE players 
     SET name = $1, position_code = $2 
     WHERE id = $3 
     RETURNING id, name, position_code AS "positionCode"`,
    [name, positionCode, id]
  );
  return result.rows[0];
}

/**
 * Registers a new player and assigns them to a team.
 * * @param {string} name - Full name of the player.
 * @param {string} positionCode - Tactical position (e.g., 'GK', 'ST').
 * @param {number} teamId - The ID of the team the player belongs to.
 * @returns {Promise<Player>} The newly created player record.
 */
export async function createPlayer(
  name: string, 
  positionCode: string, 
  teamId: number
): Promise<Player> {
  const result = await query<Player>(
    `INSERT INTO players (name, position_code, team_id) 
     VALUES ($1, $2, $3) 
     RETURNING 
      id, 
      name, 
      position_code AS "positionCode", 
      team_id AS "teamId"`,
    [name, positionCode, teamId]
  );

  return result.rows[0];
}