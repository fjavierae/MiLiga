import { query } from "@/lib/db";
import type { Player } from "@/types";
import { PLAYER_COLS, TABLES } from "./constants";

export async function getPlayersByTeam(teamId: number): Promise<Player[]> {
	const result = await query<Player>(
		`SELECT
			${PLAYER_COLS.ID},
			${PLAYER_COLS.NAME},
			${PLAYER_COLS.POSITION_CODE} AS "positionCode",
			${PLAYER_COLS.TEAM_ID} AS "teamId"
		 FROM ${TABLES.PLAYERS}
		 WHERE ${PLAYER_COLS.TEAM_ID} = $1`,
		[teamId]
	);

	return result.rows;
}

export async function updatePlayer(id: number, name: string, positionCode: string): Promise<Player> {
	const result = await query<Player>(
		`UPDATE ${TABLES.PLAYERS}
		 SET ${PLAYER_COLS.NAME} = $1,
			 ${PLAYER_COLS.POSITION_CODE} = $2
		 WHERE ${PLAYER_COLS.ID} = $3
		 RETURNING ${PLAYER_COLS.ID}, ${PLAYER_COLS.NAME}, ${PLAYER_COLS.POSITION_CODE} AS "positionCode"`,
		[name, positionCode, id]
	);

	return result.rows[0];
}

export async function createPlayer(name: string, positionCode: string, teamId: number): Promise<Player> {
	const result = await query<Player>(
		`INSERT INTO ${TABLES.PLAYERS} (${PLAYER_COLS.NAME}, ${PLAYER_COLS.POSITION_CODE}, ${PLAYER_COLS.TEAM_ID})
		 VALUES ($1, $2, $3)
		 RETURNING
			 ${PLAYER_COLS.ID},
			 ${PLAYER_COLS.NAME},
			 ${PLAYER_COLS.POSITION_CODE} AS "positionCode",
			 ${PLAYER_COLS.TEAM_ID} AS "teamId"`,
		[name, positionCode, teamId]
	);

	return result.rows[0];
}