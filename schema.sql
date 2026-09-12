CREATE TABLE IF NOT EXISTS leagues (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  code TEXT NOT NULL UNIQUE,
  name TEXT NOT NULL DEFAULT 'FantaFamily 2026/27'
);

CREATE TABLE IF NOT EXISTS players (
  api_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL,
  team_id INTEGER NOT NULL,
  team_name TEXT NOT NULL,
  position TEXT NOT NULL,
  shirt_number INTEGER
);

CREATE TABLE IF NOT EXISTS fixtures (
  api_id INTEGER PRIMARY KEY,
  round_name TEXT,
  kickoff TEXT NOT NULL,
  status TEXT NOT NULL,
  home_team_id INTEGER NOT NULL,
  home_team_name TEXT NOT NULL,
  away_team_id INTEGER NOT NULL,
  away_team_name TEXT NOT NULL,
  home_goals INTEGER,
  away_goals INTEGER
);

CREATE TABLE IF NOT EXISTS formations (
  matchday INTEGER NOT NULL,
  coach TEXT NOT NULL,
  formation TEXT NOT NULL,
  starters_json TEXT NOT NULL,
  bench_json TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (matchday, coach)
);

CREATE TABLE IF NOT EXISTS player_live (
  fixture_id INTEGER NOT NULL,
  player_id INTEGER NOT NULL,
  rating REAL,
  minutes INTEGER DEFAULT 0,
  goals INTEGER DEFAULT 0,
  assists INTEGER DEFAULT 0,
  yellow INTEGER DEFAULT 0,
  red INTEGER DEFAULT 0,
  own_goals INTEGER DEFAULT 0,
  missed_penalties INTEGER DEFAULT 0,
  saved_penalties INTEGER DEFAULT 0,
  conceded INTEGER DEFAULT 0,
  clean_sheet INTEGER DEFAULT 0,
  updated_at TEXT NOT NULL,
  PRIMARY KEY (fixture_id, player_id)
);

CREATE TABLE IF NOT EXISTS scores (
  matchday INTEGER NOT NULL,
  coach TEXT NOT NULL,
  score REAL NOT NULL DEFAULT 0,
  league_points INTEGER NOT NULL DEFAULT 0,
  PRIMARY KEY (matchday, coach)
);
