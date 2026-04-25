import { query } from "@/lib/db";
import type { Match } from "@/types";
import { MATCH_COLS, TABLES } from "./constants";

export async function getMatchesByLeague(leagueId: number): Promise<Match[]> {
	const result = await query<Match>(
		`SELECT
			${MATCH_COLS.ID},
			${MATCH_COLS.LEAGUE_ID} AS "leagueId",
			${MATCH_COLS.LOCAL_TEAM_ID} AS "localTeamId",
			${MATCH_COLS.VISITOR_TEAM_ID} AS "visitorTeamId",
			${MATCH_COLS.LOCAL_GOALS} AS "localGoals",
			${MATCH_COLS.VISITOR_GOALS} AS "visitorGoals",
			${MATCH_COLS.VENUE},
			${MATCH_COLS.DATE}::text,
			${MATCH_COLS.TIME}::text
		 FROM ${TABLES.MATCHES}
		 WHERE ${MATCH_COLS.LEAGUE_ID} = $1
		 ORDER BY ${MATCH_COLS.DATE} DESC, ${MATCH_COLS.TIME} DESC`,
		[leagueId]
	);

	return result.rows;
}

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
		`INSERT INTO ${TABLES.MATCHES} (
			${MATCH_COLS.LEAGUE_ID},
			${MATCH_COLS.LOCAL_TEAM_ID},
			${MATCH_COLS.VISITOR_TEAM_ID},
			${MATCH_COLS.LOCAL_GOALS},
			${MATCH_COLS.VISITOR_GOALS},
			${MATCH_COLS.VENUE},
			${MATCH_COLS.DATE},
			${MATCH_COLS.TIME},
			${MATCH_COLS.LOCAL_FORMATION_ID},
			${MATCH_COLS.VISITOR_FORMATION_ID}
		)
		VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
		RETURNING
			${MATCH_COLS.ID},
			${MATCH_COLS.LEAGUE_ID} AS "leagueId",
			${MATCH_COLS.LOCAL_TEAM_ID} AS "localTeamId",
			${MATCH_COLS.VISITOR_TEAM_ID} AS "visitorTeamId",
			${MATCH_COLS.LOCAL_GOALS} AS "localGoals",
			${MATCH_COLS.VISITOR_GOALS} AS "visitorGoals",
			${MATCH_COLS.VENUE},
			${MATCH_COLS.DATE}::text,
			${MATCH_COLS.TIME}::text,
			${MATCH_COLS.LOCAL_FORMATION_ID} AS "localFormationId",
			${MATCH_COLS.VISITOR_FORMATION_ID} AS "visitorFormationId"`,
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