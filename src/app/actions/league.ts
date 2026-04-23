/**
 * @module DataActions
 * @description Provides standardized CRUD (Create, Read, Update, Delete) operations 
 * for the core entities of the league management system.
 */
"use server";

import { query } from "../../lib/db";
import type { League} from "../../types";

/**
 * Retrieves all available leagues from the database.
 * @returns {Promise<League[]>} List of leagues sorted alphabetically.
 */
export async function getLeagues(): Promise<League[]> {
  const result = await query<League>("SELECT id, name FROM leagues ORDER BY name ASC");
  return result.rows;
}

/**
 * Creates a new league record.
 * @param {string} name - The unique name of the competition.
 */
export async function createLeague(name: string): Promise<League> {
  const result = await query<League>(
    "INSERT INTO leagues (name) VALUES ($1) RETURNING id, name",
    [name]
  );
  return result.rows[0];
}