/**
 * GET /api/cron/check-matches
 *
 * Called every 15 min by GitHub Actions.
 * Checks football-data.org for any WC2026 matches that finished today,
 * looks up their API-Football fixture ID, runs the scoring pipeline,
 * and stores results in scored-matches.json (or logs them if no write access).
 *
 * Protected by CRON_SECRET header.
 */

import { NextRequest, NextResponse } from 'next/server';
import { adaptFixturePlayers } from '@/lib/stats-adapter';
import { scoreMatch } from '@/lib/scoring-engine';
import { CONTRACT_ADDRESS, ENDPOINTS, CHAIN_ID } from '@/lib/network';

const FD_BASE  = 'https://api.football-data.org/v4';
const AF_BASE  = 'https://v3.football.api-sports.io';
const FD_KEY   = process.env.FOOTBALL_DATA_API_KEY;
const AF_KEY   = process.env.API_FOOTBALL_KEY;
const CRON_SECRET    = process.env.CRON_SECRET;
const ADMIN_MNEMONIC = process.env.ADMIN_MNEMONIC;

// Push scored players on-chain using the admin wallet (server-side signing)
async function pushScoresOnChain(
  fixtureId: number,
  players: { playerId: string; breakdown: { total: number } }[],
  matchScore: { home: number; away: number },
  homeTeam: string,
  awayTeam: string,
) {
  if (!ADMIN_MNEMONIC || !CONTRACT_ADDRESS) return { status: 'skipped_no_config' };
  try {
    const { DirectSecp256k1HdWallet } = await import('@cosmjs/proto-signing');
    const { SigningCosmWasmClient } = await import('@cosmjs/cosmwasm-stargate');

    const wallet = await DirectSecp256k1HdWallet.fromMnemonic(ADMIN_MNEMONIC, { prefix: 'inj' });
    const [{ address }] = await wallet.getAccounts();
    const client = await SigningCosmWasmClient.connectWithSigner(
      ENDPOINTS.rpc as string,
      wallet as any,
      { gasPrice: '500000000inj' as any },
    );

    // Map player IDs from our scoring engine to the contract's expected format
    const playerScores = players
      .filter(p => p.playerId)
      .map(p => ({ player_id: p.playerId, points: Math.max(0, p.breakdown.total) }));

    // Submit player fantasy scores
    await client.execute(address, CONTRACT_ADDRESS, {
      submit_player_scores: { fixture_id: String(fixtureId), player_scores: playerScores },
    }, 'auto');

    // Submit match result for prediction scoring
    await client.execute(address, CONTRACT_ADDRESS, {
      submit_result: {
        match_id: String(fixtureId),
        home_team: homeTeam,
        away_team: awayTeam,
        home_score: matchScore.home,
        away_score: matchScore.away,
      },
    }, 'auto');

    return { status: 'pushed', playerCount: playerScores.length, adminAddress: address };
  } catch (err: any) {
    console.error('[cron] on-chain push failed:', err?.message);
    return { status: 'push_failed', error: err?.message };
  }
}

// Simple in-process set so we don't double-score within one process lifetime.
// For persistence across deploys, swap this for a KV store (Vercel KV, Upstash, etc.)
const alreadyScored = new Set<number>();

async function getFinishedMatchesToday() {
  if (!FD_KEY) return [];
  const today = new Date().toISOString().slice(0, 10);
  const res = await fetch(
    `${FD_BASE}/competitions/WC/matches?dateFrom=${today}&dateTo=${today}&status=FINISHED`,
    { headers: { 'X-Auth-Token': FD_KEY } },
  );
  if (!res.ok) return [];
  const data = await res.json();
  return (data.matches ?? []) as Array<{
    id: number;
    homeTeam: { name: string };
    awayTeam: { name: string };
    score: { fullTime: { home: number; away: number } };
  }>;
}

// Map a football-data.org match to an API-Football fixture ID.
// API-Football's /fixtures endpoint lets you search by date + team name.
async function findAFFixtureId(
  fdMatch: { homeTeam: { name: string }; awayTeam: { name: string } },
  date: string,
): Promise<number | null> {
  if (!AF_KEY) return null;
  const res = await fetch(
    `${AF_BASE}/fixtures?date=${date}&league=1&season=2026`,
    {
      headers: { 'x-apisports-key': AF_KEY },
    },
  );
  if (!res.ok) return null;
  const data = await res.json();
  const fixtures: any[] = data.response ?? [];

  // Match by team name substring (names differ slightly between APIs)
  const normalize = (s: string) => s.toLowerCase().replace(/\s+/g, '');
  const homeN = normalize(fdMatch.homeTeam.name);
  const awayN = normalize(fdMatch.awayTeam.name);

  const found = fixtures.find((f: any) => {
    const h = normalize(f.teams?.home?.name ?? '');
    const a = normalize(f.teams?.away?.name ?? '');
    return (h.includes(homeN) || homeN.includes(h)) &&
           (a.includes(awayN) || awayN.includes(a));
  });

  return found ? found.fixture.id : null;
}

async function scoreFixture(afFixtureId: number, score: { home: number; away: number }) {
  const res = await fetch(`${AF_BASE}/fixtures/players?fixture=${afFixtureId}`, {
    headers: { 'x-apisports-key': AF_KEY! },
  });
  if (!res.ok) return null;
  const raw = await res.json();
  const adapted = adaptFixturePlayers(afFixtureId, raw, score);
  const scored  = scoreMatch(adapted.players);
  scored.sort((a, b) => b.breakdown.total - a.breakdown.total);
  return { ...adapted, players: scored };
}

export async function GET(req: NextRequest) {
  // Auth check
  const secret = req.headers.get('x-cron-secret') ?? req.nextUrl.searchParams.get('secret');
  if (CRON_SECRET && secret !== CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const today = new Date().toISOString().slice(0, 10);
  const finishedMatches = await getFinishedMatchesToday();

  if (finishedMatches.length === 0) {
    return NextResponse.json({ scored: [], message: 'No finished matches today' });
  }

  const results = [];

  for (const match of finishedMatches) {
    if (alreadyScored.has(match.id)) continue;

    const afId = await findAFFixtureId(match, today);
    if (!afId) {
      results.push({ fdId: match.id, status: 'no_af_fixture_found' });
      continue;
    }

    const scored = await scoreFixture(afId, match.score.fullTime);
    if (!scored) {
      results.push({ fdId: match.id, afId, status: 'scoring_failed' });
      continue;
    }

    alreadyScored.add(match.id);

    // Push scores on-chain automatically
    const onChain = await pushScoresOnChain(
      afId,
      scored.players,
      match.score.fullTime,
      match.homeTeam.name,
      match.awayTeam.name,
    );

    const top5 = scored.players.slice(0, 5).map(p => ({
      name: p.playerName,
      pos: p.position,
      pts: p.breakdown.total,
    }));

    results.push({
      fdId: match.id,
      afId,
      home: match.homeTeam.name,
      away: match.awayTeam.name,
      score: match.score.fullTime,
      status: 'scored',
      onChain,
      top5,
      totalPlayers: scored.players.length,
    });

    console.log(`[cron] Scored ${match.homeTeam.name} vs ${match.awayTeam.name}`, onChain.status, top5);
  }

  return NextResponse.json({ scored: results, checkedAt: new Date().toISOString() });
}
