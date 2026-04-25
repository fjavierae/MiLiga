import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { createLeague, getLeagues } from "../actions/league";
import { resetTestDatabase } from "@/tests/testDb";

const cleanup = async () => {
	await resetTestDatabase();
};

describe("League Actions", () => {
	beforeEach(async () => {
		await cleanup();
	});

	afterEach(async () => {
		await cleanup();
	});

	it("creates and lists leagues through the public action", async () => {
		const leagueName = "Elite Professional League";

		const createdLeague = await createLeague(leagueName);

		expect(createdLeague).toHaveProperty("id");
		expect(createdLeague.name).toBe(leagueName);

		const leagues = await getLeagues();
		expect(leagues).toHaveLength(1);
		expect(leagues[0].name).toBe(leagueName);
	});

	it("rejects empty league names", async () => {
		await expect(createLeague("   ")).rejects.toThrow("League name is required.");
	});
});