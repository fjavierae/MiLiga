BEGIN;

CREATE TABLE IF NOT EXISTS leagues (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL UNIQUE
);

CREATE TABLE IF NOT EXISTS teams (
  id SERIAL PRIMARY KEY,
  league_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  logo VARCHAR(255),
  main_color INTEGER,
  secondary_color INTEGER,
  default_player_image INTEGER,
  initials VARCHAR(10) NOT NULL,
  CONSTRAINT teams_league_id_fkey
    FOREIGN KEY (league_id)
    REFERENCES leagues (id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS players (
  id SERIAL PRIMARY KEY,
  team_id INTEGER NOT NULL,
  name VARCHAR(255) NOT NULL,
  position_code VARCHAR(50) NOT NULL,
  CONSTRAINT players_team_id_fkey
    FOREIGN KEY (team_id)
    REFERENCES teams (id)
    ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS formations (
  id SERIAL PRIMARY KEY,
  lineup_name VARCHAR(255) NOT NULL,
  pos1 INTEGER NOT NULL,
  pos2 INTEGER NOT NULL,
  pos3 INTEGER NOT NULL,
  pos4 INTEGER NOT NULL,
  pos5 INTEGER NOT NULL,
  pos6 INTEGER NOT NULL,
  pos7 INTEGER NOT NULL,
  is_vertical BOOLEAN NOT NULL DEFAULT FALSE
);

CREATE TABLE IF NOT EXISTS matches (
  id SERIAL PRIMARY KEY,
  league_id INTEGER NOT NULL,
  local_team_id INTEGER NOT NULL,
  visitor_team_id INTEGER NOT NULL,
  local_goals INTEGER NOT NULL DEFAULT 0,
  visitor_goals INTEGER NOT NULL DEFAULT 0,
  venue VARCHAR(255),
  date DATE NOT NULL,
  time TIME NOT NULL,
  local_formation_id INTEGER NOT NULL,
  visitor_formation_id INTEGER NOT NULL,
  CONSTRAINT matches_league_id_fkey
    FOREIGN KEY (league_id)
    REFERENCES leagues (id)
    ON DELETE CASCADE,
  CONSTRAINT matches_local_team_id_fkey
    FOREIGN KEY (local_team_id)
    REFERENCES teams (id)
    ON DELETE RESTRICT,
  CONSTRAINT matches_visitor_team_id_fkey
    FOREIGN KEY (visitor_team_id)
    REFERENCES teams (id)
    ON DELETE RESTRICT,
  CONSTRAINT matches_local_formation_id_fkey
    FOREIGN KEY (local_formation_id)
    REFERENCES formations (id)
    ON DELETE RESTRICT,
  CONSTRAINT matches_visitor_formation_id_fkey
    FOREIGN KEY (visitor_formation_id)
    REFERENCES formations (id)
    ON DELETE RESTRICT
);

CREATE TABLE IF NOT EXISTS lineup_details (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  position_id INTEGER NOT NULL,
  is_starter BOOLEAN NOT NULL DEFAULT FALSE,
  CONSTRAINT lineup_details_match_id_fkey
    FOREIGN KEY (match_id)
    REFERENCES matches (id)
    ON DELETE CASCADE,
  CONSTRAINT lineup_details_player_id_fkey
    FOREIGN KEY (player_id)
    REFERENCES players (id)
    ON DELETE CASCADE,
  CONSTRAINT lineup_details_match_id_player_id_unique
    UNIQUE (match_id, player_id)
);

CREATE TABLE IF NOT EXISTS match_statistics (
  id SERIAL PRIMARY KEY,
  match_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  goals INTEGER NOT NULL DEFAULT 0,
  assists INTEGER NOT NULL DEFAULT 0,
  red_cards INTEGER NOT NULL DEFAULT 0,
  yellow_cards INTEGER NOT NULL DEFAULT 0,
  CONSTRAINT match_statistics_match_id_fkey
    FOREIGN KEY (match_id)
    REFERENCES matches (id)
    ON DELETE CASCADE,
  CONSTRAINT match_statistics_player_id_fkey
    FOREIGN KEY (player_id)
    REFERENCES players (id)
    ON DELETE CASCADE,
  CONSTRAINT match_statistics_match_id_player_id_unique
    UNIQUE (match_id, player_id)
);

COMMIT;