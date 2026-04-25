import { query } from "@/lib/db";
import type { League } from "@/types";
import { LEAGUE_COLS, TABLES } from "./constants";

export async function getLeagues(): Promise<League[]> {
  const result = await query<League>(
    `SELECT ${LEAGUE_COLS.ID}, ${LEAGUE_COLS.NAME}
     FROM ${TABLES.LEAGUES}
     ORDER BY ${LEAGUE_COLS.NAME} ASC`
  );

  return result.rows;
}

export async function createLeague(name: string): Promise<League> {
  const result = await query<League>(
    `INSERT INTO ${TABLES.LEAGUES} (${LEAGUE_COLS.NAME})
     VALUES ($1)
     RETURNING ${LEAGUE_COLS.ID}, ${LEAGUE_COLS.NAME}`,
    [name]
  );

  return result.rows[0];
}