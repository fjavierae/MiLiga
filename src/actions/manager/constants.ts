export const TABLES = {
	USERS: "users",
	PLAYERS: "players",
	JOIN_REQUESTS: "player_join_requests",
} as const;

export const USER_COLS = {
	ID: "id",
	ROLE: "role",
	TEAM_ID: "team_id",
} as const;

export const PLAYER_COLS = {
	ID: "id",
	TEAM_ID: "team_id",
	NAME: "name",
	POSITION_CODE: "position_code",
	USER_ID: "user_id",
	JERSEY_NUMBER: "jersey_number",
} as const;

export const JOIN_REQUEST_COLS = {
	ID: "id",
	PLAYER_USER_ID: "player_user_id",
	TEAM_ID: "team_id",
	STATUS: "status",
	JERSEY_NUMBER: "jersey_number",
	REVIEWED_BY_MANAGER_ID: "reviewed_by_manager_id",
	REQUESTED_AT: "requested_at",
	REVIEWED_AT: "reviewed_at",
} as const;

export const MANAGER_ERRORS = {
	WITHOUT_TEAM: "MANAGER_WITHOUT_TEAM",
	REQUEST_NOT_FOUND: "REQUEST_NOT_FOUND",
	REQUEST_NOT_IN_MANAGER_TEAM: "REQUEST_NOT_IN_MANAGER_TEAM",
	JERSEY_ALREADY_USED: "JERSEY_ALREADY_USED",
} as const;