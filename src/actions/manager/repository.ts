import { withClient } from "@/lib/db";
import { UserRole } from "@/types";
import { JOIN_REQUEST_COLS, MANAGER_ERRORS, PLAYER_COLS, TABLES, USER_COLS } from "./constants";
import type { AcceptPlayerJoinRequestInput } from "./validation";

export interface JoinRequestNotification {
	requestId: string;
	playerUserId: string;
	playerName: string;
	playerEmail: string;
	requestedAt: string;
}

export interface ManagerActionState {
	error?: string;
	success?: string;
}

export async function getPendingJoinRequests(managerUserId: string): Promise<JoinRequestNotification[]> {
	return withClient(async (client) => {
		const managerResult = await client.query<{ team_id: number | null }>(
			`SELECT ${USER_COLS.TEAM_ID}
			 FROM ${TABLES.USERS}
			 WHERE ${USER_COLS.ID} = $1 AND ${USER_COLS.ROLE} = $2`,
			[managerUserId, UserRole.MANAGER]
		);

		const managerTeamId = managerResult.rows[0]?.team_id;

		if (!managerTeamId) {
			return [];
		}

		const requestsResult = await client.query<JoinRequestNotification>(
			`SELECT
				pjr.${JOIN_REQUEST_COLS.ID} AS "requestId",
				u.${USER_COLS.ID} AS "playerUserId",
				u.full_name AS "playerName",
				u.email AS "playerEmail",
				pjr.${JOIN_REQUEST_COLS.REQUESTED_AT}::text AS "requestedAt"
			FROM ${TABLES.JOIN_REQUESTS} pjr
			INNER JOIN ${TABLES.USERS} u ON u.${USER_COLS.ID} = pjr.${JOIN_REQUEST_COLS.PLAYER_USER_ID}
			WHERE pjr.${JOIN_REQUEST_COLS.TEAM_ID} = $1
				AND pjr.${JOIN_REQUEST_COLS.STATUS} = 'pending'
			ORDER BY pjr.${JOIN_REQUEST_COLS.REQUESTED_AT} ASC`,
			[managerTeamId]
		);

		return requestsResult.rows;
	});
}

export async function acceptPlayerJoinRequest(
	managerUserId: string,
	input: AcceptPlayerJoinRequestInput
): Promise<void> {
	await withClient(async (client) => {
		await client.query("BEGIN");

		try {
			const managerResult = await client.query<{ team_id: number | null }>(
				`SELECT ${USER_COLS.TEAM_ID}
				 FROM ${TABLES.USERS}
				 WHERE ${USER_COLS.ID} = $1 AND ${USER_COLS.ROLE} = $2`,
				[managerUserId, UserRole.MANAGER]
			);

			const managerTeamId = managerResult.rows[0]?.team_id;
			if (!managerTeamId) {
				throw new Error(MANAGER_ERRORS.WITHOUT_TEAM);
			}

			const requestResult = await client.query<{
				id: string;
				player_user_id: string;
				team_id: number;
				player_name: string;
			}>(
				`SELECT
					pjr.${JOIN_REQUEST_COLS.ID},
					pjr.${JOIN_REQUEST_COLS.PLAYER_USER_ID},
					pjr.${JOIN_REQUEST_COLS.TEAM_ID},
					u.full_name AS player_name
				 FROM ${TABLES.JOIN_REQUESTS} pjr
				 INNER JOIN ${TABLES.USERS} u ON u.${USER_COLS.ID} = pjr.${JOIN_REQUEST_COLS.PLAYER_USER_ID}
				 WHERE pjr.${JOIN_REQUEST_COLS.ID} = $1
					 AND pjr.${JOIN_REQUEST_COLS.STATUS} = 'pending'
				 FOR UPDATE`,
				[input.requestId]
			);

			const request = requestResult.rows[0];

			if (!request) {
				throw new Error(MANAGER_ERRORS.REQUEST_NOT_FOUND);
			}

			if (request.team_id !== managerTeamId) {
				throw new Error(MANAGER_ERRORS.REQUEST_NOT_IN_MANAGER_TEAM);
			}

			const jerseyInUse = await client.query(
				`SELECT ${PLAYER_COLS.ID}
				 FROM ${TABLES.PLAYERS}
				 WHERE ${PLAYER_COLS.TEAM_ID} = $1 AND ${PLAYER_COLS.JERSEY_NUMBER} = $2`,
				[managerTeamId, input.jerseyNumber]
			);

			if ((jerseyInUse.rowCount ?? 0) > 0) {
				throw new Error(MANAGER_ERRORS.JERSEY_ALREADY_USED);
			}

			await client.query(
				`UPDATE ${TABLES.JOIN_REQUESTS}
				 SET ${JOIN_REQUEST_COLS.STATUS} = 'accepted',
					 ${JOIN_REQUEST_COLS.JERSEY_NUMBER} = $2,
					 ${JOIN_REQUEST_COLS.REVIEWED_BY_MANAGER_ID} = $3,
					 ${JOIN_REQUEST_COLS.REVIEWED_AT} = CURRENT_TIMESTAMP
				 WHERE ${JOIN_REQUEST_COLS.ID} = $1`,
				[input.requestId, input.jerseyNumber, managerUserId]
			);

			await client.query(
				`UPDATE ${TABLES.USERS}
				 SET ${USER_COLS.TEAM_ID} = $2,
					 updated_at = CURRENT_TIMESTAMP,
					 status = 'active'
				 WHERE ${USER_COLS.ID} = $1`,
				[request.player_user_id, managerTeamId]
			);

			await client.query(
				`INSERT INTO ${TABLES.PLAYERS} (${PLAYER_COLS.TEAM_ID}, ${PLAYER_COLS.NAME}, ${PLAYER_COLS.POSITION_CODE}, ${PLAYER_COLS.USER_ID}, ${PLAYER_COLS.JERSEY_NUMBER})
				 VALUES ($1, $2, 'UNK', $3, $4)
				 ON CONFLICT (${PLAYER_COLS.USER_ID})
				 DO UPDATE
				 SET ${PLAYER_COLS.TEAM_ID} = EXCLUDED.${PLAYER_COLS.TEAM_ID},
					 ${PLAYER_COLS.NAME} = EXCLUDED.${PLAYER_COLS.NAME},
					 ${PLAYER_COLS.JERSEY_NUMBER} = EXCLUDED.${PLAYER_COLS.JERSEY_NUMBER}`,
				[managerTeamId, request.player_name, request.player_user_id, input.jerseyNumber]
			);

			await client.query("COMMIT");
		} catch (error) {
			await client.query("ROLLBACK");
			throw error;
		}
	});
}