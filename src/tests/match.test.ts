import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { query } from "../lib/db";
import { createLeague } from "../actions/league";
import { createTeam } from "../actions/team";
import { createMatch, getMatchesByLeague } from "../actions/match";
import { resetTestDatabase } from "@/tests/testDb";

const cleanup = async () => {
	await resetTestDatabase();
};

describe("Match Actions", () => {
	beforeEach(async () => {
		await cleanup();
	});

	afterEach(async () => {
		await cleanup();
	});

	it("creates and lists matches through the public action", async () => {
		const league = await createLeague("Pro Match League");
		const teamA = await createTeam({
			leagueId: league.id,
			name: "Home United",
			logo: null,
			mainColor: null,
			secondaryColor: null,
			defaultPlayerImage: null,
			initials: "HUT",
		});
		const teamB = await createTeam({
			leagueId: league.id,
			name: "Away Rovers",
			logo: null,
			mainColor: null,
			secondaryColor: null,
			defaultPlayerImage: null,
			initials: "ARO",
		});

		const formationRes = await query(
			`INSERT INTO formations (lineup_name, pos1, pos2, pos3, pos4, pos5, pos6, pos7, is_vertical)
			 VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
			["4-3-3 Professional", 1, 2, 3, 4, 5, 6, 7, true]
		);
		const formationId = formationRes.rows[0].id;

		const match = await createMatch({
			leagueId: league.id,
			localTeamId: teamA.id,
			visitorTeamId: teamB.id,
			localGoals: 0,
			visitorGoals: 0,
			venue: "Central Stadium",
			date: "2026-10-12",
			time: "20:00",
			localFormationId: formationId,
			visitorFormationId: formationId,
		});

		expect(match.localTeamId).toBe(teamA.id);
		expect(match.visitorTeamId).toBe(teamB.id);
		expect(match.venue).toBe("Central Stadium");

		const matches = await getMatchesByLeague(league.id);
		expect(matches).toHaveLength(1);
	});

	it("rejects invalid league ids when listing matches", async () => {
		await expect(getMatchesByLeague(0)).rejects.toThrow("Invalid league id.");
	});
});