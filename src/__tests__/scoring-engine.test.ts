/**
 * Scoring Engine — deterministic rule verification
 * Each test block covers exactly one scoring rule.
 */

import { scoreMatch, scoreSinglePlayer, formatBreakdown } from '@/lib/scoring-engine';
import type { PlayerMatchStats } from '@/types/scoring';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function base(overrides: Partial<PlayerMatchStats> = {}): PlayerMatchStats {
  return {
    playerId: 'p1', playerName: 'Test Player', position: 'MID', teamId: 'team1',
    minutesPlayed: 90, goals: 0, assists: 0, penaltiesMissed: 0, penaltiesTaken: 0,
    shotsOnTarget: 0, shotsOffTarget: 0, keyPasses: 0, successfulDribbles: 0,
    fouledWon: 0, saves: 0, penaltiesSaved: 0, cleanSheet: false, goalsConceded: 0,
    tackles: 0, interceptions: 0, clearances: 0, blocks: 0, recoveries: 0,
    yellowCards: 0, redCards: 0, ownGoals: 0, errorsLeadingToGoal: 0,
    foulsCommitted: 0, offsides: 0,
    ...overrides,
  };
}

// ─── 1. Appearance ────────────────────────────────────────────────────────────

describe('Rule 1a — Appearance < 60 mins → 1pt', () => {
  it('59 mins = 1pt', () => {
    const s = scoreSinglePlayer(base({ minutesPlayed: 59 }));
    expect(s.breakdown.appearance).toBe(1);
  });
  it('1 min = 1pt', () => {
    const s = scoreSinglePlayer(base({ minutesPlayed: 1 }));
    expect(s.breakdown.appearance).toBe(1);
  });
  it('0 mins = 0pt', () => {
    const s = scoreSinglePlayer(base({ minutesPlayed: 0 }));
    expect(s.breakdown.appearance).toBe(0);
  });
});

describe('Rule 1b — Appearance ≥ 60 mins → 2pts', () => {
  it('60 mins = 2pts', () => {
    const s = scoreSinglePlayer(base({ minutesPlayed: 60 }));
    expect(s.breakdown.appearance).toBe(2);
  });
  it('90 mins = 2pts', () => {
    const s = scoreSinglePlayer(base({ minutesPlayed: 90 }));
    expect(s.breakdown.appearance).toBe(2);
  });
});

// ─── 2. Goals ─────────────────────────────────────────────────────────────────

describe('Rule 2 — Goal points by position', () => {
  it('GK goal = 6pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', goals: 1 })).breakdown.goals).toBe(6);
  });
  it('DEF goal = 6pts', () => {
    expect(scoreSinglePlayer(base({ position: 'DEF', goals: 1 })).breakdown.goals).toBe(6);
  });
  it('MID goal = 5pts', () => {
    expect(scoreSinglePlayer(base({ position: 'MID', goals: 1 })).breakdown.goals).toBe(5);
  });
  it('FWD goal = 4pts', () => {
    expect(scoreSinglePlayer(base({ position: 'FWD', goals: 1 })).breakdown.goals).toBe(4);
  });
  it('MID hat-trick = 15pts', () => {
    expect(scoreSinglePlayer(base({ position: 'MID', goals: 3 })).breakdown.goals).toBe(15);
  });
});

// ─── 3. Assists ───────────────────────────────────────────────────────────────

describe('Rule 3 — Assists', () => {
  it('1 assist = 3pts', () => {
    expect(scoreSinglePlayer(base({ assists: 1 })).breakdown.assists).toBe(3);
  });
  it('2 assists = 6pts', () => {
    expect(scoreSinglePlayer(base({ assists: 2 })).breakdown.assists).toBe(6);
  });
});

// ─── 4. Clean sheets ──────────────────────────────────────────────────────────

describe('Rule 4 — Clean sheets', () => {
  it('GK clean sheet 90 mins = 4pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', cleanSheet: true, minutesPlayed: 90 })).breakdown.cleanSheet).toBe(4);
  });
  it('DEF clean sheet 60 mins = 4pts', () => {
    expect(scoreSinglePlayer(base({ position: 'DEF', cleanSheet: true, minutesPlayed: 60 })).breakdown.cleanSheet).toBe(4);
  });
  it('MID clean sheet 60 mins = 1pt', () => {
    expect(scoreSinglePlayer(base({ position: 'MID', cleanSheet: true, minutesPlayed: 60 })).breakdown.cleanSheet).toBe(1);
  });
  it('FWD clean sheet = 0pts regardless', () => {
    expect(scoreSinglePlayer(base({ position: 'FWD', cleanSheet: true, minutesPlayed: 90 })).breakdown.cleanSheet).toBe(0);
  });
  it('GK clean sheet < 60 mins = 0pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', cleanSheet: true, minutesPlayed: 59 })).breakdown.cleanSheet).toBe(0);
  });
  it('MID clean sheet 59 mins = 0pts (less than 60)', () => {
    expect(scoreSinglePlayer(base({ position: 'MID', cleanSheet: true, minutesPlayed: 59 })).breakdown.cleanSheet).toBe(0);
  });
});

// ─── 5. GK Saves ─────────────────────────────────────────────────────────────

describe('Rule 5a — GK saves (1pt per 3)', () => {
  it('2 saves = 0pts (floor)', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', saves: 2 })).breakdown.saves).toBe(0);
  });
  it('3 saves = 1pt', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', saves: 3 })).breakdown.saves).toBe(1);
  });
  it('5 saves = 1pt (floor)', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', saves: 5 })).breakdown.saves).toBe(1);
  });
  it('6 saves = 2pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', saves: 6 })).breakdown.saves).toBe(2);
  });
  it('MID saves = 0pts (not GK)', () => {
    expect(scoreSinglePlayer(base({ position: 'MID', saves: 9 })).breakdown.saves).toBe(0);
  });
});

describe('Rule 5b — Penalty save (+5pts, GK only)', () => {
  it('1 penalty save = 5pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', penaltiesSaved: 1 })).breakdown.penaltySaves).toBe(5);
  });
  it('2 penalty saves = 10pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', penaltiesSaved: 2 })).breakdown.penaltySaves).toBe(10);
  });
  it('DEF penalty save = 0pts', () => {
    expect(scoreSinglePlayer(base({ position: 'DEF', penaltiesSaved: 1 })).breakdown.penaltySaves).toBe(0);
  });
});

// ─── 6. Penalty miss ─────────────────────────────────────────────────────────

describe('Rule 6 — Penalty miss (-2pts, all positions)', () => {
  it('FWD missed penalty = -2pts', () => {
    expect(scoreSinglePlayer(base({ position: 'FWD', penaltiesMissed: 1 })).breakdown.penaltyMisses).toBe(-2);
  });
  it('GK missed penalty = -2pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', penaltiesMissed: 1 })).breakdown.penaltyMisses).toBe(-2);
  });
  it('2 missed penalties = -4pts', () => {
    expect(scoreSinglePlayer(base({ penaltiesMissed: 2 })).breakdown.penaltyMisses).toBe(-4);
  });
});

// ─── 7. Discipline ───────────────────────────────────────────────────────────

describe('Rule 7 — Discipline', () => {
  it('Yellow card = -1pt', () => {
    expect(scoreSinglePlayer(base({ yellowCards: 1 })).breakdown.yellowCards).toBe(-1);
  });
  it('Red card = -3pts', () => {
    expect(scoreSinglePlayer(base({ redCards: 1 })).breakdown.redCards).toBe(-3);
  });
  it('2 yellow cards = -2pts', () => {
    expect(scoreSinglePlayer(base({ yellowCards: 2 })).breakdown.yellowCards).toBe(-2);
  });
});

// ─── 8. Own goals ────────────────────────────────────────────────────────────

describe('Rule 8 — Own goals (-2pts each)', () => {
  it('1 own goal = -2pts', () => {
    expect(scoreSinglePlayer(base({ ownGoals: 1 })).breakdown.ownGoals).toBe(-2);
  });
  it('2 own goals = -4pts', () => {
    expect(scoreSinglePlayer(base({ ownGoals: 2 })).breakdown.ownGoals).toBe(-4);
  });
});

// ─── 9. Goals conceded (GK/DEF only) ────────────────────────────────────────

describe('Rule 9 — Goals conceded (-1pt per 2, GK/DEF only)', () => {
  it('GK concedes 1 = 0pts (floor)', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', goalsConceded: 1 })).breakdown.goalsConceded).toBe(0);
  });
  it('GK concedes 2 = -1pt', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', goalsConceded: 2 })).breakdown.goalsConceded).toBe(-1);
  });
  it('GK concedes 3 = -1pt (floor)', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', goalsConceded: 3 })).breakdown.goalsConceded).toBe(-1);
  });
  it('GK concedes 4 = -2pts', () => {
    expect(scoreSinglePlayer(base({ position: 'GK', goalsConceded: 4 })).breakdown.goalsConceded).toBe(-2);
  });
  it('DEF concedes 2 = -1pt', () => {
    expect(scoreSinglePlayer(base({ position: 'DEF', goalsConceded: 2 })).breakdown.goalsConceded).toBe(-1);
  });
  it('MID concedes 10 = 0pts (not penalised)', () => {
    expect(scoreSinglePlayer(base({ position: 'MID', goalsConceded: 10 })).breakdown.goalsConceded).toBe(0);
  });
  it('FWD concedes 10 = 0pts', () => {
    expect(scoreSinglePlayer(base({ position: 'FWD', goalsConceded: 10 })).breakdown.goalsConceded).toBe(0);
  });
});

// ─── 10. Defensive actions (2pts per 10 combined) ────────────────────────────

describe('Rule 10 — Defensive contributions', () => {
  it('9 combined actions = 0pts (floor)', () => {
    const s = scoreSinglePlayer(base({ tackles: 3, interceptions: 3, clearances: 2, blocks: 1 }));
    expect(s.breakdown.defensiveActions).toBe(0);
  });
  it('10 combined actions = 2pts', () => {
    const s = scoreSinglePlayer(base({ tackles: 4, interceptions: 3, clearances: 2, blocks: 1 }));
    expect(s.breakdown.defensiveActions).toBe(2);
  });
  it('19 combined actions = 2pts (floor)', () => {
    const s = scoreSinglePlayer(base({ tackles: 5, interceptions: 5, clearances: 5, blocks: 4 }));
    expect(s.breakdown.defensiveActions).toBe(2);
  });
  it('20 combined actions = 4pts', () => {
    const s = scoreSinglePlayer(base({ tackles: 5, interceptions: 5, clearances: 5, blocks: 5 }));
    expect(s.breakdown.defensiveActions).toBe(4);
  });
});

// ─── 11. BPS bonus ────────────────────────────────────────────────────────────

describe('Rule 11 — BPS bonus assignment', () => {
  it('Top 3 unique scores get 3, 2, 1 bonus', () => {
    const players = [
      base({ playerId: 'a', goals: 2, position: 'FWD' }),   // highest
      base({ playerId: 'b', assists: 1 }),                    // mid
      base({ playerId: 'c', minutesPlayed: 45 }),             // lowest of these 3
      base({ playerId: 'd', minutesPlayed: 1 }),              // well below
    ];
    const scored = scoreMatch(players);
    const byId = Object.fromEntries(scored.map((s) => [s.playerId, s.breakdown.bpsBonus]));
    expect(byId['a']).toBe(3);
    expect(byId['b']).toBe(2);
    expect(byId['c']).toBe(1);
    expect(byId['d']).toBe(0);
  });

  it('Tied BPS: both tied players get higher bonus, next gets tier after them', () => {
    // Two players tied for 1st → both get 3pts; 3rd player gets 1pt (not 2pt)
    const players = [
      base({ playerId: 'x', goals: 1, position: 'MID' }),   // 5pts BPS goal + mins
      base({ playerId: 'y', goals: 1, position: 'MID' }),   // identical stats
      base({ playerId: 'z', assists: 1 }),                    // lower BPS
    ];
    const scored = scoreMatch(players);
    const byId = Object.fromEntries(scored.map((s) => [s.playerId, s.breakdown.bpsBonus]));
    expect(byId['x']).toBe(3);
    expect(byId['y']).toBe(3);
    expect(byId['z']).toBe(1);  // 3rd tier (not 2nd — two slots consumed by tie)
  });
});

// ─── 12. Missing data detection ──────────────────────────────────────────────

describe('Rule 12 — Missing data is noted, not estimated', () => {
  it('undefined tackles is reported in missingFields', () => {
    const stats = base();
    (stats as any).tackles = undefined;
    const s = scoreSinglePlayer(stats);
    expect(s.breakdown.missingFields).toContain('tackles');
  });

  it('missing saves field is reported for GK', () => {
    const stats = base({ position: 'GK' });
    (stats as any).saves = undefined;
    const s = scoreSinglePlayer(stats);
    expect(s.breakdown.missingFields).toContain('saves');
    // Should NOT add save points for missing data
    expect(s.breakdown.saves).toBe(0);
  });
});

// ─── 13. Total score integration ─────────────────────────────────────────────

describe('Integration — realistic player totals', () => {
  it('FWD goal + assist + 90 mins = 4+3+2 = 9pts base (no bonus)', () => {
    const s = scoreSinglePlayer(base({ position: 'FWD', goals: 1, assists: 1, minutesPlayed: 90 }));
    expect(s.breakdown.total).toBe(9); // 2 (app) + 4 (goal) + 3 (assist)
  });

  it('GK clean sheet, 5 saves, 90 mins = 2+4+1 = 7pts base', () => {
    const s = scoreSinglePlayer(base({
      position: 'GK', minutesPlayed: 90, cleanSheet: true, saves: 5, goalsConceded: 0,
    }));
    // 2 (app) + 4 (CS) + 1 (5÷3=1 save pt) = 7
    expect(s.breakdown.total).toBe(7);
  });

  it('DEF goal, yellow card, 2 goals conceded, 90 mins = 2+6-1-1 = 6pts', () => {
    const s = scoreSinglePlayer(base({
      position: 'DEF', minutesPlayed: 90, goals: 1, yellowCards: 1, goalsConceded: 2,
    }));
    // 2 + 6 - 1 - 1 = 6
    expect(s.breakdown.total).toBe(6);
  });

  it('MID red card, own goal = 2-3-2 = -3pts total', () => {
    const s = scoreSinglePlayer(base({
      position: 'MID', minutesPlayed: 90, redCards: 1, ownGoals: 1,
    }));
    // 2 - 3 - 2 = -3
    expect(s.breakdown.total).toBe(-3);
  });
});

// ─── 14. formatBreakdown smoke test ──────────────────────────────────────────

describe('formatBreakdown', () => {
  it('returns a non-empty string', () => {
    const s = scoreSinglePlayer(base({ goals: 1, assists: 1 }));
    const text = formatBreakdown(s);
    expect(typeof text).toBe('string');
    expect(text.length).toBeGreaterThan(0);
    expect(text).toContain('pts');
  });
});
