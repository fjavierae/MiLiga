import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { query } from "../lib/db";
import { createLeague } from "../actions/league";
import { createTeam } from "../actions/team";
import { getPendingJoinRequests, acceptPlayerJoinRequest } from "../actions/manager";
import { getSession } from "@/lib/auth";
import { UserRole } from "../types";
import { resetTestDatabase } from "@/tests/testDb";

vi.mock("@/lib/auth", () => ({
	getSession: vi.fn(),
}));

const mockedGetSession = getSession as unknown as {
	mockReset: () => void;
	mockResolvedValue: (value: { id: string; role: UserRole } | null) => void;
};

const cleanup = async () => {
	await resetTestDatabase();
};

const seedManagerScenario = async () => {
	const league = await createLeague("Manager Testing League");
	const team = await createTeam({
		leagueId: league.id,
		name: "Manager FC",
		logo: null,
		mainColor: null,
		secondaryColor: null,
		defaultPlayerImage: null,
		initials: "MFC",
	});

	const managerUser = await query<{ id: string }>(
		`INSERT INTO users (email, full_name, password_hash, role, status, team_id)
		 VALUES ($1, $2, $3, $4, $5, $6)
		 RETURNING id`,
		[
			"manager-test@myleague.local",
			"Manager Test",
			"hash",
			UserRole.MANAGER,
			"active",
			team.id,
		]
	);

	const playerUser = await query<{ id: string }>(
		`INSERT INTO users (email, full_name, password_hash, role, status)
		 VALUES ($1, $2, $3, $4, $5)
		 RETURNING id`,
		[
			"player-test@myleague.local",
			"Player Test",
			"hash",
			UserRole.PLAYER,
			"pending",
		]
	);

	const request = await query<{ id: string }>(
		`INSERT INTO player_join_requests (player_user_id, team_id, status)
		 VALUES ($1, $2, $3)
		 RETURNING id`,
		[playerUser.rows[0].id, team.id, "pending"]
	);

	return { teamId: team.id, managerUserId: managerUser.rows[0].id, requestId: request.rows[0].id };
};

describe("Manager Actions", () => {
	beforeEach(async () => {
		mockedGetSession.mockReset();
		await cleanup();
	});

	afterEach(async () => {
		mockedGetSession.mockReset();
		await cleanup();
	});

	it("lists pending join requests through the public action", async () => {
		const { managerUserId, requestId } = await seedManagerScenario();

		mockedGetSession.mockResolvedValue({
			id: managerUserId,
			role: UserRole.MANAGER,
		});

		const requests = await getPendingJoinRequests();

		expect(requests).toHaveLength(1);
		expect(requests[0].requestId).toBe(requestId);
	});

	it("accepts a player request and assigns a jersey number", async () => {
		const { managerUserId, requestId, teamId } = await seedManagerScenario();

		mockedGetSession.mockResolvedValue({
			id: managerUserId,
			role: UserRole.MANAGER,
		});

		const formData = new FormData();
		formData.set("requestId", requestId);
		formData.set("jerseyNumber", "7");

		const result = await acceptPlayerJoinRequest({} as never, formData);

		expect(result.success).toBe("Jugador aceptado correctamente.");

		const updatedUser = await query<{ status: string; team_id: number | null }>(
			"SELECT status, team_id FROM users WHERE email = $1",
			["player-test@myleague.local"]
		);
		expect(updatedUser.rows[0].status).toBe("active");
		expect(updatedUser.rows[0].team_id).toBe(teamId);

		const playerRow = await query<{ jersey_number: number }>(
			"SELECT jersey_number FROM players WHERE team_id = $1",
			[teamId]
		);
		expect(playerRow.rows[0].jersey_number).toBe(7);
 	});
});