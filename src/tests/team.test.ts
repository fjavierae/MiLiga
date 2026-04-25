import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createLeague } from "../actions/league";
import { createTeam, deleteTeam, getTeamsByLeague } from "../actions/team";
import { resetTestDatabase } from "@/tests/testDb";

const cleanup = async () => {
	await resetTestDatabase();
};

describe("Team Actions", () => {
	beforeEach(async () => {
		await cleanup();
	});

	afterEach(async () => {
		await cleanup();
	});

	it("creates, lists, and deletes teams through the public action", async () => {
		const league = await createLeague("Team Assignment League");

		const team = await createTeam({
			leagueId: league.id,
			name: "London Strikers",
			initials: "LST",
			logo: "strikers_logo.png",
			mainColor: 16711680,
			secondaryColor: 16777215,
			defaultPlayerImage: null,
		});

		expect(team.name).toBe("London Strikers");
		expect(team.leagueId).toBe(league.id);

		const teams = await getTeamsByLeague(league.id);
		expect(teams).toHaveLength(1);

		await deleteTeam(team.id);

		const teamsAfterDelete = await getTeamsByLeague(league.id);
		expect(teamsAfterDelete).toHaveLength(0);
	});

	it("rejects invalid team ids when listing teams", async () => {
		await expect(getTeamsByLeague(0)).rejects.toThrow("Invalid league id.");
	});
});