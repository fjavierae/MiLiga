/**
 * @module Types
 * @description Core interfaces and utility functions for the League Management System.
 * This module defines the data structures for leagues, teams, players, matches, and statistics.
 */

/**
 * User roles in the system.
 * - UserRole.ADMIN: League Commissioner - Full system control and audit capabilities
 * - UserRole.MANAGER: Team Leader - Team management and match reporting
 * - UserRole.PLAYER: End User - Personal stats and calendar view
 */
export enum UserRole {
  ADMIN = "admin",
  MANAGER = "manager",
  PLAYER = "player",
}

/**
 * User account status for player registrations.
 * - UserStatus.PENDING: Awaiting manager approval after registration
 * - UserStatus.ACTIVE: Approved and active player with access to the system
 * - UserStatus.REJECTED: Registration denied by manager, no access granted
 */
export enum UserStatus {
  PENDING = "pending",
  ACTIVE = "active",
  REJECTED = "rejected",
}

/**
 * Represents a user in the system with authentication and role information.
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  status: UserStatus;
  teamId?: number;
  playerId?: number;
}

/**
 * Represents a high-level competition group.
 */
export interface League {
  id: number;
  name: string;
}

/**
 * Represents a football club belonging to a specific league.
 */
export interface Team {
  id: number;
  leagueId: number;
  name: string;
  /** Storage filename for the team's crest. */
  logo: string | null;
  /** Hexadecimal or Integer representation of the primary brand color. */
  mainColor: number | null;
  /** Hexadecimal or Integer representation of the secondary brand color. */
  secondaryColor: number | null;
  /** Reference ID for a default placeholder image for players. */
  defaultPlayerImage: number | null;
  /** Short abbreviation (e.g., "RMD", "BAR"). */
  initials: string;
}

/**
 * Represents an individual athlete assigned to a team.
 */
export interface Player {
  id: number;
  name: string;
  /** Short code for the pitch position (e.g., 'GK', 'ST', 'CM'). */
  positionCode: string;
  teamId: number;
  jerseyNumber?: number | null;
  userId?: string | null;
}

/**
 * Represents a scheduled or completed game between two teams.
 */
export interface Match {
  id: number;
  leagueId: number;
  localTeamId: number;
  visitorTeamId: number;
  localGoals: number;
  visitorGoals: number;
  /** Stadium name or physical location. */
  venue: string | null;
  /** ISO format date (YYYY-MM-DD). */
  date: string;
  /** Localized time string (HH:mm). */
  time: string;
  /** Reference to the tactical setup for the home team. */
  localFormationId: number;
  /** Reference to the tactical setup for the away team. */
  visitorFormationId: number;
}

/**
 * Defines a tactical formation (e.g., 2-3-1) and visual coordinates.
 */
export interface Formation {
  id: number;
  /** Descriptive name (e.g., "Classic 2-3-1"). */
  lineupName: string;
  /** Positional IDs representing specific areas on the pitch. */
  pos1: number;
  pos2: number;
  pos3: number;
  pos4: number;
  pos5: number;
  pos6: number;
  pos7: number;
  /** Pitch orientation: true for vertical, false for horizontal. */
  isVertical: boolean;
}

/**
 * Join table entry linking players to specific matches and positions.
 */
export interface LineupDetail {
  id: number;
  matchId: number;
  playerId: number;
  positionId: number;
  /** Indicates if the player started the match. */
  isStarter: boolean;
}

/**
 * Performance metrics for a player during a specific match.
 */
export interface MatchStatistic {
  matchId: number;
  playerId: number;
  goals: number;
  assists: number;
  redCards: number;
  yellowCards: number;
}



/**
 * Resolves a partial logo path into a fully qualified URL.
 * * @param {string | null | undefined} logo - The filename of the logo stored in the database.
 * @returns {string | null} The complete URL for the image or null if no logo is provided.
 * * @example
 * Ex: resolveTeamLogoUrl("madrid.png") // returns "https://api.myapp.com/uploads/madrid.png"
 */
export const resolveTeamLogoUrl = (logo: string | null | undefined): string | null => {
  if (!logo) {
    return null;
  }  

  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "") ?? "";

  return `${baseUrl}/uploads/${logo}`;
};

/**
 * Utility class to standardize API responses across the application.
 * Encapsulates both successful data and error messages in a consistent structure.
 * Provides methods to easily check for success and retrieve data or errors.
 */
export class Response<T> {
    private readonly data: T | null;
    private readonly error: string | null;

    constructor(data: T | null = null, error: string | null = null) {
        this.data = data;
        this.error = error;
    }

    public getData(): T | null {
        return this.data;
    }

    public getError(): string | null {
        return this.error;
    }

    public isSuccess(): boolean {
        return this.error === null;
    }
}