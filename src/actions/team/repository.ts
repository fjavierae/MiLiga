import { query } from "@/lib/db";
import type { Team } from "@/types";
import { TABLES, TEAM_COLS } from "./constants";

export async function getTeamsByLeague(leagueId: number): Promise<Team[]> {
	const result = await query<Team>(
		`SELECT
			${TEAM_COLS.ID},
			${TEAM_COLS.LEAGUE_ID} AS "leagueId",
			${TEAM_COLS.NAME},
			${TEAM_COLS.LOGO},
			${TEAM_COLS.INITIALS}
		 FROM ${TABLES.TEAMS}
		 WHERE ${TEAM_COLS.LEAGUE_ID} = $1
		 ORDER BY ${TEAM_COLS.NAME} ASC`,
		[leagueId]
	);

	return result.rows;
}

export async function deleteTeam(id: number): Promise<void> {
	await query(`DELETE FROM ${TABLES.TEAMS} WHERE ${TEAM_COLS.ID} = $1`, [id]);
}

export async function createTeam(teamData: Omit<Team, "id">): Promise<Team> {
	const {
		leagueId,
		name,
		logo,
		mainColor,
		secondaryColor,
		defaultPlayerImage,
		initials,
	} = teamData;

	const result = await query<Team>(
		`INSERT INTO ${TABLES.TEAMS} (
			${TEAM_COLS.LEAGUE_ID},
			${TEAM_COLS.NAME},
			${TEAM_COLS.LOGO},
			${TEAM_COLS.MAIN_COLOR},
			${TEAM_COLS.SECONDARY_COLOR},
			${TEAM_COLS.DEFAULT_PLAYER_IMAGE},
			${TEAM_COLS.INITIALS}
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7)
		RETURNING
			${TEAM_COLS.ID},
			${TEAM_COLS.LEAGUE_ID} AS "leagueId",
			${TEAM_COLS.NAME},
			${TEAM_COLS.LOGO},
			${TEAM_COLS.MAIN_COLOR} AS "mainColor",
			${TEAM_COLS.SECONDARY_COLOR} AS "secondaryColor",
			${TEAM_COLS.DEFAULT_PLAYER_IMAGE} AS "defaultPlayerImage",
			${TEAM_COLS.INITIALS}`,
		[leagueId, name, logo, mainColor, secondaryColor, defaultPlayerImage, initials]
	);

	return result.rows[0];
}