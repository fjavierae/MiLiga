/**
 * @module ActionsIntegrationTests
 * @description Integration tests for the League Management System Server Actions.
 * These tests validate the interaction between the application logic and the PostgreSQL database.
 */

import { describe, it, expect, afterEach } from "vitest";
import { query } from "../lib/db";
import { createLeague, getLeagues } from "../actions/league";
import { createTeam, getTeamsByLeague } from "../actions/team";
import { createPlayer, updatePlayer } from "../actions/player";
import { createMatch } from "../actions/match";

describe("Database Actions Integration Tests", () => {

  /**
   * Performs a deep cleanup after each individual test.
   * TRUNCATE is used to wipe table contents.
   * CASCADE ensures that dependent records (e.g., players within teams) are also removed.
   * RESTART IDENTITY resets the primary key sequences to 1.
   */
  afterEach(async () => {
    await query("TRUNCATE TABLE leagues, formations RESTART IDENTITY CASCADE");
  });

  /* -------------------------------------------------------------------------- */
  /* LEAGUE ACTION TESTS                                                        */
  /* -------------------------------------------------------------------------- */
  describe("League Actions", () => {
    /**
     * Verifies that a league can be successfully persisted and then retrieved.
     */
    it("should successfully create a new league and verify its existence", async () => {
      const leagueName = "Elite Professional League";
      const newLeague = await createLeague(leagueName);

      expect(newLeague).toHaveProperty("id");
      expect(newLeague.name).toBe(leagueName);

      const allLeagues = await getLeagues();
      expect(allLeagues.some(l => l.id === newLeague.id)).toBe(true);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* TEAM ACTION TESTS                                                          */
  /* -------------------------------------------------------------------------- */
  describe("Team Actions", () => {
    /**
     * Ensures that a team is correctly associated with a league upon creation.
     */
    it("should create a team record linked to an existing league", async () => {
      // Setup: A parent league is required due to foreign key constraints
      const league = await createLeague("Test League for Team Assignment");
      
      const teamData = {
        leagueId: league.id,
        name: "London Strikers",
        initials: "LST",
        logo: "strikers_logo.png",
        mainColor: 16711680,
        secondaryColor: 16777215,
        defaultPlayerImage: null
      };

      const team = await createTeam(teamData);
      expect(team.name).toBe("London Strikers");
      expect(team.leagueId).toBe(league.id);

      const teams = await getTeamsByLeague(league.id);
      expect(teams.length).toBe(1);
    });
  });

  /* -------------------------------------------------------------------------- */
  /* PLAYER ACTION TESTS                                                        */
  /* -------------------------------------------------------------------------- */
  describe("Player Actions", () => {
    /**
     * Validates the end-to-end flow of player registration and profile updates.
     */
    it("should register a player and update their tactical information", async () => {
      // Setup: Hierarchy creation (League -> Team)
      const league = await createLeague("Player Testing League");
      const team = await createTeam({
        leagueId: league.id, name: "Development FC", initials: "DFC",
        logo: null, mainColor: null, secondaryColor: null, defaultPlayerImage: null
      });

      // Execution: Player Creation
      const player = await createPlayer("Julian Test", "ST", team.id);
      expect(player.name).toBe("Julian Test");

      // Execution: Player Update
      const updated = await updatePlayer(player.id, "Julian Updated", "CF");
      expect(updated.name).toBe("Julian Updated");
      expect(updated.positionCode).toBe("CF");
    });
  });

  /* -------------------------------------------------------------------------- */
  /* MATCH ACTION TESTS                                                         */
  /* -------------------------------------------------------------------------- */
  describe("Match Actions", () => {
    /**
     * Validates match scheduling.
     * Note: Formations must be manually inserted to satisfy foreign key requirements.
     */
    it("should schedule a match between two teams using a valid formation", async () => {
      // 1. Dependency Setup
      const league = await createLeague("Pro Match League");
      const teamA = await createTeam({ leagueId: league.id, name: "Home United", initials: "HUT", logo: null, mainColor: null, secondaryColor: null, defaultPlayerImage: null });
      const teamB = await createTeam({ leagueId: league.id, name: "Away Rovers", initials: "ARO", logo: null, mainColor: null, secondaryColor: null, defaultPlayerImage: null });

      // 2. Tactical Setup: Required to prevent 'matches_local_formation_id_fkey' violations
      const formationRes = await query(
        `INSERT INTO formations (lineup_name, pos1, pos2, pos3, pos4, pos5, pos6, pos7, is_vertical) 
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id`,
        ["4-3-3 Professional", 1, 2, 3, 4, 5, 6, 7, true]
      );
      const formationId = formationRes.rows[0].id;

      // 3. Main Action Execution
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
        visitorFormationId: formationId
      });

      expect(match.localTeamId).toBe(teamA.id);
      expect(match.venue).toBe("Central Stadium");
      expect(match.visitorTeamId).toBe(teamB.id);
    });
  });
});