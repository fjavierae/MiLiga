import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { query } from "../lib/db";
import { createLeague } from "../actions/league";
import { createTeam } from "../actions/team";
import { createPlayer, getPlayersByTeam, updatePlayer } from "../actions/player";
import { resetTestDatabase } from "@/tests/testDb";

const cleanup = async () => {
	await resetTestDatabase();
};

describe("Player Actions", () => {
	beforeEach(async () => {
		await cleanup();
	});

	afterEach(async () => {
		await cleanup();
	});

	it("creates, lists, and updates players through the public action", async () => {
		const league = await createLeague("Player Testing League");
		const team = await createTeam({
			leagueId: league.id,
			name: "Development FC",
			logo: null,
			mainColor: null,
			secondaryColor: null,
			defaultPlayerImage: null,
			initials: "DFC",
		});

		const player = await createPlayer("Julian Test", "ST", team.id);

		expect(player.name).toBe("Julian Test");
		expect(player.teamId).toBe(team.id);

		const roster = await getPlayersByTeam(team.id);
		expect(roster).toHaveLength(1);

		await updatePlayer(player.id, "Julian Updated", "CF");

		const updatedPlayer = await query<{ name: string; position_code: string }>(
			"SELECT name, position_code FROM players WHERE id = $1",
			[player.id]
		);
		expect(updatedPlayer.rows[0].name).toBe("Julian Updated");
		expect(updatedPlayer.rows[0].position_code).toBe("CF");
	});

	it("rejects invalid player creation data", async () => {
		await expect(createPlayer("", "ST", 1)).rejects.toThrow("Player name is required.");
	});
});