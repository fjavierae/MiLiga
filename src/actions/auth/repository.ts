import { query, withClient } from "@/lib/db";
import { UserRole, UserStatus, User } from "@/types";
import type { RegisterPlayerInput } from "./validation";
import { AUTH_ERRORS, TABLES, USER_COLS, USER_PROJECTION, REQUEST_COLS } from "./constants";

export interface AuthUserRecord extends User{
	passwordHash: string;
}

/**
 * Retrieves a user record by email for authentication purposes.
 * @param email - The unique user email.
 * @returns AuthUserRecord or null if not found.
 */
export async function findUserByEmail(email: string): Promise<AuthUserRecord | null> {
    const result = await query<AuthUserRecord>(
        `SELECT ${USER_PROJECTION} 
         FROM ${TABLES.USERS} 
         WHERE ${USER_COLS.EMAIL} = $1`,
        [email]
    );

    return result.rows[0] ?? null;
}

/**
 * Orchestrates the registration of a new player.
 * Includes team validation, user creation, and join request initialization 
 * within a single database client transaction logic.
 */
export async function registerPendingPlayer(
    input: RegisterPlayerInput,
    hashedPassword: string
): Promise<void> {
    await withClient(async (client) => {
        // 1. Validate team existence
        const teamCheck = await client.query(
            `SELECT id FROM ${TABLES.TEAMS} WHERE id = $1`,
            [input.teamId]
        );

        if (teamCheck.rowCount === 0) {
            throw new Error(AUTH_ERRORS.TEAM_NOT_FOUND);
        }

        // 2. Persist new user record
        const userResult = await client.query<{ id: string }>(
            `INSERT INTO ${TABLES.USERS} (
                ${USER_COLS.EMAIL}, 
                ${USER_COLS.FULL_NAME}, 
                ${USER_COLS.PWD_HASH}, 
                ${USER_COLS.ROLE}, 
                ${USER_COLS.STATUS}, 
                ${USER_COLS.TEAM_ID}
             )
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING ${USER_COLS.ID}`,
            [
                input.email,
                input.fullName,
                hashedPassword,
                UserRole.PLAYER,
                UserStatus.PENDING,
                input.teamId
            ]
        );

        const newUserId = userResult.rows[0].id;

        // 3. Initialize join request record
        await client.query(
            `INSERT INTO ${TABLES.JOIN_REQUESTS} (
                ${REQUEST_COLS.PLAYER_ID}, 
                ${REQUEST_COLS.TEAM_ID}, 
                ${REQUEST_COLS.STATUS}
             )
             VALUES ($1, $2, $3)`,
            [newUserId, input.teamId, UserStatus.PENDING]
        );
    });
}