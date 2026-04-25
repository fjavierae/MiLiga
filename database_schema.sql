BEGIN;

CREATE EXTENSION IF NOT EXISTS pgcrypto;

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
  jersey_number INTEGER,
  CONSTRAINT players_team_id_fkey
    FOREIGN KEY (team_id)
    REFERENCES teams (id)
    ON DELETE CASCADE,
  CONSTRAINT players_jersey_number_check
    CHECK (jersey_number IS NULL OR (jersey_number >= 1 AND jersey_number <= 99))
);

CREATE UNIQUE INDEX IF NOT EXISTS idx_players_team_jersey_unique
  ON players(team_id, jersey_number)
  WHERE jersey_number IS NOT NULL;

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

CREATE TYPE user_role AS ENUM ('player', 'manager', 'admin');
CREATE TYPE user_status AS ENUM ('pending', 'active', 'rejected');
CREATE TYPE join_request_status AS ENUM ('pending', 'accepted', 'rejected');

CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email TEXT UNIQUE NOT NULL,
    full_name TEXT NOT NULL,
    password_hash TEXT NOT NULL,
    role user_role NOT NULL DEFAULT 'player',
    status user_status NOT NULL DEFAULT 'active',
    team_id INTEGER,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT users_team_id_fkey
      FOREIGN KEY (team_id)
      REFERENCES teams (id)
      ON DELETE SET NULL
);

ALTER TABLE players
  ADD COLUMN IF NOT EXISTS user_id UUID UNIQUE;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'players_user_id_fkey'
  ) THEN
    ALTER TABLE players
      ADD CONSTRAINT players_user_id_fkey
      FOREIGN KEY (user_id)
      REFERENCES users (id)
      ON DELETE SET NULL;
  END IF;
END $$;

CREATE TABLE IF NOT EXISTS player_join_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  player_user_id UUID NOT NULL UNIQUE,
  team_id INTEGER NOT NULL,
  status join_request_status NOT NULL DEFAULT 'pending',
  jersey_number INTEGER,
  reviewed_by_manager_id UUID,
  requested_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT CURRENT_TIMESTAMP,
  reviewed_at TIMESTAMP WITH TIME ZONE,
  CONSTRAINT player_join_requests_player_user_id_fkey
    FOREIGN KEY (player_user_id)
    REFERENCES users (id)
    ON DELETE CASCADE,
  CONSTRAINT player_join_requests_team_id_fkey
    FOREIGN KEY (team_id)
    REFERENCES teams (id)
    ON DELETE CASCADE,
  CONSTRAINT player_join_requests_reviewed_by_manager_id_fkey
    FOREIGN KEY (reviewed_by_manager_id)
    REFERENCES users (id)
    ON DELETE SET NULL,
  CONSTRAINT player_join_requests_jersey_number_check
    CHECK (jersey_number IS NULL OR (jersey_number >= 1 AND jersey_number <= 99))
);

CREATE INDEX idx_player_join_requests_team_status
  ON player_join_requests(team_id, status);

CREATE UNIQUE INDEX idx_join_requests_team_jersey_accepted_unique
  ON player_join_requests(team_id, jersey_number)
  WHERE status = 'accepted' AND jersey_number IS NOT NULL;

CREATE INDEX idx_users_email ON users(email);

INSERT INTO users (email, full_name, password_hash, role, status)
VALUES
  (
    'admin@myleague.local',
    'Administrador Principal',
    '$2b$10$wM0Tokwm/d6MBK/vSRJOZOpio7VzbhiG1/leq8Ld/TkBZMusgPpiK',
    'admin',
    'active'
  ),
  (
    'manager@myleague.local',
    'Manager Inicial',
    '$2b$10$sq06Ys/vfsX4hvvFG.zTjuWX.esL6rQype5qCvJ27wKFcvmwn4RyW',
    'manager',
    'active'
  )
ON CONFLICT (email) DO NOTHING;

COMMIT;