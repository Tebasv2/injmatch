/**
 * Maps API-Football fixture player stats response → PlayerMatchStats[]
 *
 * API-Football endpoint used:
 *   GET https://v3.football.api-sports.io/fixtures/players?fixture={id}
 *
 * Response shape (per team, per player):
 *   player: { id, name }
 *   statistics[0]: {
 *     games: { minutes, position, rating }
 *     goals:  { total, conceded, assists, saves }
 *     shots:  { total, on }
 *     passes: { total, key, accuracy }
 *     tackles: { total, blocks, interceptions }
 *     duels:   { total, won }
 *     dribbles:{ attempts, success }
 *     fouls:   { drawn, committed }
 *     cards:   { yellow, red }
 *     penalty: { won, committed, scored, missed, saved }
 *   }
 */

import type { PlayerMatchStats, Position } from '@/types/scoring';

// API-Football position strings → our Position type
const POS_MAP: Record<string, Position> = {
  G: 'GK',
  D: 'DEF',
  M: 'MID',
  F: 'FWD',
};

function mapPosition(raw: string | null | undefined): Position {
  if (!raw) return 'MID';
  return POS_MAP[raw.toUpperCase().charAt(0)] ?? 'MID';
}

function n(v: number | null | undefined): number {
  return v ?? 0;
}

// Each team block from /fixtures/players response
interface APITeamBlock {
  team: { id: number; name: string };
  players: APIPlayerEntry[];
}

interface APIPlayerEntry {
  player: { id: number; name: string };
  statistics: APIPlayerStats[];
}

interface APIPlayerStats {
  games: {
    minutes: number | null;
    position: string | null;
  };
  goals: {
    total: number | null;
    conceded: number | null;
    assists: number | null;
    saves: number | null;
  };
  shots: {
    total: number | null;
    on: number | null;   // on target
  };
  passes: {
    key: number | null;
  };
  tackles: {
    total: number | null;
    blocks: number | null;
    interceptions: number | null;
  };
  dribbles: {
    success: number | null;
  };
  fouls: {
    drawn: number | null;
    committed: number | null;
  };
  cards: {
    yellow: number | null;
    red: number | null;
  };
  penalty: {
    missed: number | null;
    saved: number | null;
    scored: number | null;
    won: number | null;   // penalties drawn (earned)
  };
  duels?: {
    total: number | null;
    won: number | null;
  };
}

export interface AdaptedMatch {
  fixtureId: number;
  homeTeamId: number;
  awayTeamId: number;
  homeGoals: number;
  awayGoals: number;
  players: PlayerMatchStats[];
}

/**
 * Convert the raw API-Football /fixtures/players response into our typed format.
 *
 * @param fixtureId  numeric fixture id from API-Football
 * @param response   the raw JSON body from GET /fixtures/players?fixture={id}
 * @param matchScore { home: number, away: number } — needed to compute clean sheets
 *                   and goals-conceded-while-on-pitch
 */
export function adaptFixturePlayers(
  fixtureId: number,
  response: { response: APITeamBlock[] },
  matchScore: { home: number; away: number },
): AdaptedMatch {
  const teams = response.response ?? [];
  if (teams.length < 2) {
    return { fixtureId, homeTeamId: 0, awayTeamId: 0, homeGoals: 0, awayGoals: 0, players: [] };
  }

  const homeTeamId = teams[0].team.id;
  const awayTeamId = teams[1].team.id;

  const players: PlayerMatchStats[] = [];

  for (const teamBlock of teams) {
    const isHomeTeam = teamBlock.team.id === homeTeamId;
    // Goals scored by the opposition = goals this team conceded
    const goalsAgainst = isHomeTeam ? matchScore.away : matchScore.home;
    const cleanSheet = goalsAgainst === 0;

    for (const entry of teamBlock.players) {
      const s = entry.statistics[0];
      if (!s) continue;

      const mins = n(s.games.minutes);
      const pos  = mapPosition(s.games.position);

      // Goals conceded while on pitch — approximate: if player played full game
      // use total goals against; if sub, we only know they were on pitch (no
      // granular timeline from free tier — noted as approximation).
      const goalsConceded = mins > 0 ? goalsAgainst : 0;

      // Saves are listed under goals.saves for GK
      const saves = pos === 'GK' ? n(s.goals.saves) : 0;

      // Shots on target excludes the goal itself per FPL convention
      const shotsOnTarget = Math.max(0, n(s.shots.on) - n(s.goals.total));

      players.push({
        playerId:           String(entry.player.id),
        playerName:         entry.player.name,
        position:           pos,
        teamId:             String(teamBlock.team.id),
        minutesPlayed:      mins,
        goals:              n(s.goals.total),
        assists:            n(s.goals.assists),
        penaltiesMissed:    n(s.penalty.missed),
        penaltiesTaken:     n(s.penalty.won),
        shotsOnTarget,
        shotsOffTarget:     Math.max(0, n(s.shots.total) - n(s.shots.on)),
        keyPasses:          n(s.passes.key),
        successfulDribbles: n(s.dribbles.success),
        fouledWon:          n(s.fouls.drawn),
        saves,
        penaltiesSaved:     n(s.penalty.saved),
        cleanSheet:         cleanSheet && mins >= 60,
        goalsConceded,
        tackles:            n(s.tackles.total),
        interceptions:      n(s.tackles.interceptions),
        clearances:         0,    // not in API-Football free tier — noted missing
        blocks:             n(s.tackles.blocks),
        recoveries:         0,    // not available on free tier
        yellowCards:        n(s.cards.yellow),
        redCards:           n(s.cards.red),
        ownGoals:           0,    // own goals not in player stats endpoint — noted
        errorsLeadingToGoal: 0,   // not available on free tier
        foulsCommitted:     n(s.fouls.committed),
        offsides:           0,    // not in player stats endpoint
      });
    }
  }

  return {
    fixtureId,
    homeTeamId,
    awayTeamId,
    homeGoals: matchScore.home,
    awayGoals: matchScore.away,
    players,
  };
}
