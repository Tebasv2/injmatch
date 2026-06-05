/**
 * GET /api/score-match/[matchId]
 *
 * Full pipeline:
 *   1. Fetch fixture result from football-data.org (score)
 *   2. Fetch player stats from API-Football
 *   3. Adapt raw stats → PlayerMatchStats[]
 *   4. Run scoring engine → ScoredPlayer[]
 *   5. Return scored players + metadata
 *
 * matchId must be an API-Football fixture ID.
 * Pass ?fdMatchId=<football-data.org match ID> if you also want the score
 * resolved from football-data.org; otherwise supply ?homeGoals=N&awayGoals=N.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adaptFixturePlayers } from '@/lib/stats-adapter';
import { scoreMatch } from '@/lib/scoring-engine';

const AF_BASE = 'https://v3.football.api-sports.io';
const FD_BASE = 'https://api.football-data.org/v4';
const AF_KEY  = process.env.API_FOOTBALL_KEY;
const FD_KEY  = process.env.FOOTBALL_DATA_API_KEY;

async function fetchScore(fdMatchId: string): Promise<{ home: number; away: number } | null> {
  if (!FD_KEY) return null;
  const res = await fetch(`${FD_BASE}/matches/${fdMatchId}`, {
    headers: { 'X-Auth-Token': FD_KEY },
  });
  if (!res.ok) return null;
  const data = await res.json();
  const score = data?.match?.score?.fullTime;
  if (score?.home == null) return null;
  return { home: score.home, away: score.away };
}

async function fetchPlayerStats(matchId: string) {
  if (!AF_KEY) return null;
  const res = await fetch(`${AF_BASE}/fixtures/players?fixture=${matchId}`, {
    headers: { 'x-apisports-key': AF_KEY! },
  });
  if (!res.ok) return null;
  return res.json();
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const { matchId } = await params;
  const sp = req.nextUrl.searchParams;

  // Resolve score
  let matchScore: { home: number; away: number } | null = null;

  const homeQ = sp.get('homeGoals');
  const awayQ = sp.get('awayGoals');
  if (homeQ !== null && awayQ !== null) {
    matchScore = { home: parseInt(homeQ, 10), away: parseInt(awayQ, 10) };
  } else {
    const fdId = sp.get('fdMatchId');
    if (fdId) {
      matchScore = await fetchScore(fdId);
    }
  }

  if (!matchScore) {
    return NextResponse.json(
      { error: 'Cannot determine match score. Supply ?homeGoals=N&awayGoals=N or ?fdMatchId=<id>' },
      { status: 400 },
    );
  }

  // Fetch player stats
  const rawStats = await fetchPlayerStats(matchId);
  if (!rawStats) {
    return NextResponse.json(
      { error: 'Failed to fetch player stats. Check API_FOOTBALL_KEY.' },
      { status: 503 },
    );
  }

  // Adapt + score
  const adapted = adaptFixturePlayers(parseInt(matchId, 10), rawStats, matchScore);
  const scored  = scoreMatch(adapted.players);

  // Sort by total desc
  scored.sort((a, b) => b.breakdown.total - a.breakdown.total);

  return NextResponse.json({
    fixtureId:  adapted.fixtureId,
    homeTeamId: adapted.homeTeamId,
    awayTeamId: adapted.awayTeamId,
    score:      matchScore,
    players:    scored,
  });
}
