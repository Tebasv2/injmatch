/**
 * InjMatch FPL-style Scoring Engine
 *
 * Deterministic rule-based calculation — no subjective ratings.
 * All inputs come from Opta match statistics.
 * Missing fields are noted but never estimated.
 */

import type { PlayerMatchStats, ScoreBreakdown, ScoredPlayer, Position } from '@/types/scoring';

// ─── Rule constants ───────────────────────────────────────────────────────────

const GOAL_PTS: Record<Position, number>       = { GK: 6, DEF: 6, MID: 5, FWD: 4 };
const CLEAN_SHEET_PTS: Record<Position, number> = { GK: 4, DEF: 4, MID: 1, FWD: 0 };

const APPEARANCE_SHORT = 1;   // < 60 mins
const APPEARANCE_LONG  = 2;   // ≥ 60 mins
const ASSIST_PTS       = 3;
const SAVE_PTS_PER_3   = 1;   // 1pt per 3 saves (floor)
const PENALTY_SAVE_PTS = 5;
const PENALTY_MISS_PTS = -2;
const YELLOW_CARD_PTS  = -1;
const RED_CARD_PTS     = -3;
const OWN_GOAL_PTS     = -2;
const GOALS_CONCEDED_DIVISOR = 2;   // -1pt per 2 goals conceded (floor), GK/DEF only
const DEF_ACTIONS_PTS  = 2;         // +2pts per 10 combined defensive actions (floor)
const DEF_ACTIONS_DIV  = 10;

// ─── BPS weights (standard Opta BPS system) ──────────────────────────────────
// Used only for ranking — absolute values don't affect final score directly.

const BPS_WEIGHTS = {
  minutesPlayed:        0.5,   // per minute (90 min → 45 BPS)
  goalGK:              12,
  goalDEF:             12,
  goalMID:             18,
  goalFWD:             24,
  assist:               9,
  penaltyEarned:        3,     // per penalty won
  shotOnTarget:         2,
  keyPass:              1,
  successfulDribble:    1,
  tackle:               2,
  interception:         1,
  block:                2,
  clearance:            1,
  recovery:             1,
  foulWon:              1,
  save:                 1,     // per save (GK)
  penaltySaved:        15,
  yellowCard:          -3,
  redCard:             -9,
  foulCommitted:       -1,
  offside:             -1,
  ownGoal:             -6,
  penaltyMiss:         -6,
  errorLeadingToGoal:  -3,
  shotOffTarget:       -1,
};

const GOAL_BPS_BY_POS: Record<Position, number> = {
  GK:  BPS_WEIGHTS.goalGK,
  DEF: BPS_WEIGHTS.goalDEF,
  MID: BPS_WEIGHTS.goalMID,
  FWD: BPS_WEIGHTS.goalFWD,
};

// ─── Missing field detection ──────────────────────────────────────────────────

function detectMissing(stats: PlayerMatchStats): string[] {
  const missing: string[] = [];
  const optional: (keyof PlayerMatchStats)[] = [
    'saves', 'penaltiesSaved', 'penaltiesMissed', 'cleanSheet',
    'goalsConceded', 'tackles', 'interceptions', 'clearances', 'blocks',
    'shotsOnTarget', 'shotsOffTarget', 'keyPasses', 'successfulDribbles',
    'fouledWon', 'recoveries', 'errorsLeadingToGoal', 'foulsCommitted',
    'offsides', 'yellowCards', 'redCards', 'ownGoals',
  ];
  for (const field of optional) {
    if (stats[field] === undefined || stats[field] === null) {
      missing.push(field);
    }
  }
  return missing;
}

// Helper — default to 0 when optional field is missing
function val(v: number | undefined | null): number {
  return v ?? 0;
}

// ─── BPS raw score ────────────────────────────────────────────────────────────

function computeBPS(stats: PlayerMatchStats): number {
  const w = BPS_WEIGHTS;
  let bps = 0;

  bps += stats.minutesPlayed * w.minutesPlayed;
  bps += val(stats.goals) * GOAL_BPS_BY_POS[stats.position];
  bps += val(stats.assists) * w.assist;
  bps += val(stats.penaltiesTaken) * w.penaltyEarned;
  bps += val(stats.shotsOnTarget) * w.shotOnTarget;
  bps += val(stats.shotsOffTarget) * w.shotOffTarget;
  bps += val(stats.keyPasses) * w.keyPass;
  bps += val(stats.successfulDribbles) * w.successfulDribble;
  bps += val(stats.tackles) * w.tackle;
  bps += val(stats.interceptions) * w.interception;
  bps += val(stats.blocks) * w.block;
  bps += val(stats.clearances) * w.clearance;
  bps += val(stats.recoveries) * w.recovery;
  bps += val(stats.fouledWon) * w.foulWon;
  bps += val(stats.saves) * w.save;
  bps += val(stats.penaltiesSaved) * w.penaltySaved;
  bps += val(stats.yellowCards) * w.yellowCard;
  bps += val(stats.redCards) * w.redCard;
  bps += val(stats.foulsCommitted) * w.foulCommitted;
  bps += val(stats.offsides) * w.offside;
  bps += val(stats.ownGoals) * w.ownGoal;
  bps += val(stats.penaltiesMissed) * w.penaltyMiss;
  bps += val(stats.errorsLeadingToGoal) * w.errorLeadingToGoal;

  return bps;
}

// ─── BPS bonus assignment ─────────────────────────────────────────────────────
// Top scorer → 3pts, second → 2pts, third → 1pt.
// Ties: all tied players receive the higher bonus.
//   e.g. two players tied for 1st both get 3pts; the next player gets 1pt (not 2).

function assignBPSBonus(bpsScores: { playerId: string; bps: number }[]): Map<string, number> {
  const sorted = [...bpsScores].sort((a, b) => b.bps - a.bps);
  const bonusMap = new Map<string, number>();
  const bonusTiers = [3, 2, 1];
  let tierIdx = 0;
  let i = 0;

  while (i < sorted.length && tierIdx < bonusTiers.length) {
    const currentBPS = sorted[i].bps;
    // Collect all tied players at this BPS score
    const tied: string[] = [];
    while (i < sorted.length && sorted[i].bps === currentBPS) {
      tied.push(sorted[i].playerId);
      i++;
    }
    const bonus = bonusTiers[tierIdx];
    for (const id of tied) bonusMap.set(id, bonus);
    // Advance tier by number of players consumed
    tierIdx += tied.length;
  }

  return bonusMap;
}

// ─── Score a single player ────────────────────────────────────────────────────

function scorePlayer(
  stats: PlayerMatchStats,
  bpsBonus: number,
): ScoreBreakdown {
  const pos = stats.position;
  const mins = stats.minutesPlayed;
  const missingFields = detectMissing(stats);

  // 1. Appearance
  const appearance = mins === 0 ? 0 : mins < 60 ? APPEARANCE_SHORT : APPEARANCE_LONG;

  // 2. Goals
  const goals = val(stats.goals) * GOAL_PTS[pos];

  // 3. Assists
  const assists = val(stats.assists) * ASSIST_PTS;

  // 4. Clean sheet (requires 60+ mins, MID gets 1pt, FWD gets 0)
  let cleanSheet = 0;
  if (stats.cleanSheet && mins >= 60) {
    cleanSheet = CLEAN_SHEET_PTS[pos];
  }

  // 5. GK saves (1pt per 3)
  const savePts = pos === 'GK'
    ? Math.floor(val(stats.saves) / 3) * SAVE_PTS_PER_3
    : 0;

  // 6. Penalty saves (+5 each, GK only)
  const penaltySaves = pos === 'GK'
    ? val(stats.penaltiesSaved) * PENALTY_SAVE_PTS
    : 0;

  // 7. Penalty misses (-2 each, all positions)
  const penaltyMisses = val(stats.penaltiesMissed) * PENALTY_MISS_PTS;

  // 8. Discipline
  const yellowCards = val(stats.yellowCards) * YELLOW_CARD_PTS;
  const redCards    = val(stats.redCards)    * RED_CARD_PTS;

  // 9. Own goals (-2 each)
  const ownGoals = val(stats.ownGoals) * OWN_GOAL_PTS;

  // 10. Goals conceded (-1 per 2, GK/DEF only, while on pitch)
  let goalsConcededPts = 0;
  if ((pos === 'GK' || pos === 'DEF') && stats.goalsConceded !== undefined) {
    const n = Math.floor(val(stats.goalsConceded) / GOALS_CONCEDED_DIVISOR);
    goalsConcededPts = n > 0 ? -n : 0;
  }

  // 11. Defensive actions (2pts per 10 combined: tackles + interceptions + clearances + blocks)
  const defActionsTotal =
    val(stats.tackles) +
    val(stats.interceptions) +
    val(stats.clearances) +
    val(stats.blocks);
  const defensiveActions = Math.floor(defActionsTotal / DEF_ACTIONS_DIV) * DEF_ACTIONS_PTS;

  // 12. BPS bonus (passed in from match-level ranking)
  const bpsRaw = computeBPS(stats);

  const total =
    appearance +
    goals +
    assists +
    cleanSheet +
    savePts +
    penaltySaves +
    penaltyMisses +
    yellowCards +
    redCards +
    ownGoals +
    goalsConcededPts +
    defensiveActions +
    bpsBonus;

  return {
    appearance,
    goals,
    assists,
    cleanSheet,
    saves: savePts,
    penaltySaves,
    penaltyMisses,
    yellowCards,
    redCards,
    ownGoals,
    goalsConceded: goalsConcededPts,
    defensiveActions,
    bpsRaw,
    bpsBonus,
    missingFields,
    total,
  };
}

// ─── Public API ───────────────────────────────────────────────────────────────

/**
 * Score all players in a match.
 * Pass all PlayerMatchStats from a single fixture.
 * Returns each player's full breakdown plus BPS bonus assignment.
 */
export function scoreMatch(allStats: PlayerMatchStats[]): ScoredPlayer[] {
  // Step 1: compute raw BPS for every player
  const bpsScores = allStats.map((s) => ({ playerId: s.playerId, bps: computeBPS(s) }));

  // Step 2: assign bonus points via BPS ranking
  const bonusMap = assignBPSBonus(bpsScores);

  // Step 3: score each player
  return allStats.map((stats) => ({
    playerId:   stats.playerId,
    playerName: stats.playerName,
    position:   stats.position,
    stats,
    breakdown:  scorePlayer(stats, bonusMap.get(stats.playerId) ?? 0),
  }));
}

/**
 * Score a single player in isolation.
 * Bonus points will be 0 — call scoreMatch() if you need BPS rankings.
 */
export function scoreSinglePlayer(stats: PlayerMatchStats): ScoredPlayer {
  return {
    playerId:   stats.playerId,
    playerName: stats.playerName,
    position:   stats.position,
    stats,
    breakdown:  scorePlayer(stats, 0),
  };
}

/**
 * Human-readable summary of a player's score breakdown.
 */
export function formatBreakdown(scored: ScoredPlayer): string {
  const b = scored.breakdown;
  const lines: string[] = [
    `${scored.playerName} (${scored.position}) — ${b.total} pts`,
    `  Appearance:          ${b.appearance > 0 ? '+' : ''}${b.appearance}`,
  ];

  if (b.goals !== 0)            lines.push(`  Goals:               +${b.goals}`);
  if (b.assists !== 0)          lines.push(`  Assists:             +${b.assists}`);
  if (b.cleanSheet !== 0)       lines.push(`  Clean Sheet:         +${b.cleanSheet}`);
  if (b.saves !== 0)            lines.push(`  GK Saves (÷3):       +${b.saves}`);
  if (b.penaltySaves !== 0)     lines.push(`  Penalty Saves:       +${b.penaltySaves}`);
  if (b.defensiveActions !== 0) lines.push(`  Def. Actions (÷10):  +${b.defensiveActions}`);
  if (b.bpsBonus !== 0)         lines.push(`  BPS Bonus:           +${b.bpsBonus}  (raw BPS: ${b.bpsRaw.toFixed(1)})`);
  if (b.goalsConceded !== 0)    lines.push(`  Goals Conceded:       ${b.goalsConceded}`);
  if (b.penaltyMisses !== 0)    lines.push(`  Penalty Miss:         ${b.penaltyMisses}`);
  if (b.yellowCards !== 0)      lines.push(`  Yellow Card:          ${b.yellowCards}`);
  if (b.redCards !== 0)         lines.push(`  Red Card:             ${b.redCards}`);
  if (b.ownGoals !== 0)         lines.push(`  Own Goals:            ${b.ownGoals}`);

  if (b.missingFields.length > 0) {
    lines.push(`  ⚠ Missing data: ${b.missingFields.join(', ')}`);
  }

  return lines.join('\n');
}
