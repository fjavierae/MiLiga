/**
 * Database Schema Constants
 * Organized by table to ensure scalability and maintainability.
 */
export const TABLES = {
    USERS: "users",
    TEAMS: "teams",
    JOIN_REQUESTS: "player_join_requests",
} as const;

export const USER_COLS = {
    ID: "id",
    EMAIL: "email",
    FULL_NAME: "full_name",
    PWD_HASH: "password_hash",
    ROLE: "role",
    STATUS: "status",
    TEAM_ID: "team_id",
} as const;

export const REQUEST_COLS = {
    PLAYER_ID: "player_user_id",
    TEAM_ID: "team_id",
    STATUS: "status",
} as const;

/**
 * SQL Projection for User selection.
 * Maps snake_case database columns to camelCase TypeScript properties.
 */
export const USER_PROJECTION = [
    USER_COLS.ID,
    USER_COLS.EMAIL,
    `${USER_COLS.PWD_HASH} AS "passwordHash"`,
    USER_COLS.ROLE,
    USER_COLS.STATUS,
    `${USER_COLS.TEAM_ID} AS "teamId"`
].join(", ");

/**
 * Standardized Error Definitions
 */
export const AUTH_ERRORS = {
    TEAM_NOT_FOUND: "TEAM_NOT_FOUND",
} as const;