export const TABLES = {
	MATCHES: "matches",
} as const;

export const MATCH_COLS = {
	ID: "id",
	LEAGUE_ID: "league_id",
	LOCAL_TEAM_ID: "local_team_id",
	VISITOR_TEAM_ID: "visitor_team_id",
	LOCAL_GOALS: "local_goals",
	VISITOR_GOALS: "visitor_goals",
	VENUE: "venue",
	DATE: "date",
	TIME: "time",
	LOCAL_FORMATION_ID: "local_formation_id",
	VISITOR_FORMATION_ID: "visitor_formation_id",
} as const;