// ─── Raw match stats per player (Opta data shape) ────────────────────────────
// All fields optional — missing fields are noted in the score breakdown.

export type Position = 'GK' | 'DEF' | 'MID' | 'FWD';

export interface PlayerMatchStats {
  playerId: string;
  playerName: string;
  position: Position;
  teamId: string;

  // Participation
  minutesPlayed: number;           // 0–120

  // Attacking
  goals: number;
  assists: number;
  penaltiesMissed: number;
  penaltiesTaken: number;          // used for BPS penalty-earned calc
  shotsOnTarget: number;           // excludes goals
  shotsOffTarget: number;
  keyPasses: number;               // pass that directly creates shot
  successfulDribbles: number;
  fouledWon: number;               // fouls drawn

  // Defensive
  saves: number;                   // GK only
  penaltiesSaved: number;          // GK only
  cleanSheet: boolean;             // team kept clean sheet AND player played 60+
  goalsConceded: number;           // goals conceded while player was on pitch (GK/DEF)
  tackles: number;
  interceptions: number;
  clearances: number;
  blocks: number;
  recoveries: number;

  // Discipline / errors
  yellowCards: number;
  redCards: number;
  ownGoals: number;
  errorsLeadingToGoal: number;
  foulsCommitted: number;
  offsides: number;                // attacker offsides
}

// ─── Per-rule score breakdown ─────────────────────────────────────────────────

export interface ScoreBreakdown {
  // Base
  appearance: number;
  goals: number;
  assists: number;
  cleanSheet: number;
  saves: number;               // 1pt per 3 saves
  penaltySaves: number;        // 5pt each
  penaltyMisses: number;       // -2pt each
  yellowCards: number;         // -1pt each
  redCards: number;            // -3pt each
  ownGoals: number;            // -2pt each
  goalsConceded: number;       // -1pt per 2 (GK/DEF)

  // Defensive contributions
  defensiveActions: number;    // 2pt per 10 combined actions

  // BPS bonus
  bpsRaw: number;              // raw BPS score
  bpsBonus: number;            // 0, 1, 2, or 3

  // Missing data
  missingFields: string[];

  total: number;
}

export interface ScoredPlayer {
  playerId: string;
  playerName: string;
  position: Position;
  stats: PlayerMatchStats;
  breakdown: ScoreBreakdown;
}
