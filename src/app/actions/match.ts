/**
 * @module DataActions
 * @description Provides standardized CRUD (Create, Read, Update, Delete) operations 
 * for the core entities of the league management system.
 */
"use server";

import { query } from "../../lib/db";
import type { Match} from "../../types";

/**
 * Fetches the match schedule for a given league.
 * @returns {Promise<Match[]>} List of matches sorted by date and time.
 */
export async function getMatchesByLeague(leagueId: number): Promise<Match[]> {
  const result = await query<Match>(
    `SELECT 
      id, 
      league_id AS "leagueId", 
      local_team_id AS "localTeamId", 
      visitor_team_id AS "visitorTeamId",
      local_goals AS "localGoals", 
      visitor_goals AS "visitorGoals",
      venue, 
      date::text, 
      time::text
    FROM matches 
    WHERE league_id = $1 
    ORDER BY date DESC, time DESC`,
    [leagueId]
  );
  return result.rows;
}

/**
 * Schedules a new match between two teams within a league.
 * * @param {Omit<Match, "id">} matchData - The match details excluding the auto-generated ID.
 * @returns {Promise<Match>} The newly created match record with mapped field names.
 */
export async function createMatch(matchData: Omit<Match, "id">): Promise<Match> {
  const {
    leagueId,
    localTeamId,
    visitorTeamId,
    localGoals,
    visitorGoals,
    venue,
    date,
    time,
    localFormationId,
    visitorFormationId,
  } = matchData;

  const result = await query<Match>(
    `INSERT INTO matches (
      league_id, 
      local_team_id, 
      visitor_team_id, 
      local_goals, 
      visitor_goals, 
      venue, 
      date, 
      time, 
      local_formation_id, 
      visitor_formation_id
    ) 
    VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
    RETURNING 
      id, 
      league_id AS "leagueId", 
      local_team_id AS "localTeamId", 
      visitor_team_id AS "visitorTeamId",
      local_goals AS "localGoals", 
      visitor_goals AS "visitorGoals",
      venue, 
      date::text, 
      time::text,
      local_formation_id AS "localFormationId",
      visitor_formation_id AS "visitorFormationId"`,
    [
      leagueId,
      localTeamId,
      visitorTeamId,
      localGoals,
      visitorGoals,
      venue,
      date,
      time,
      localFormationId,
      visitorFormationId,
    ]
  );

  return result.rows[0];
}