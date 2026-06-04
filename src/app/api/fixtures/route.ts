import { NextResponse } from 'next/server';
import { ALL_FIXTURES } from '@/lib/wc2026-fixtures';

// football-data.org free tier — register at football-data.org for a free API key
// Competition: WC (FIFA World Cup), season 2026
const FD_BASE = 'https://api.football-data.org/v4';
const API_KEY = process.env.FOOTBALL_DATA_API_KEY;

export const revalidate = 60; // revalidate every 60s (ISR)

export async function GET() {
  // If no API key, return hardcoded fixtures as-is
  if (!API_KEY) {
    return NextResponse.json({ fixtures: ALL_FIXTURES, source: 'static' });
  }

  try {
    const res = await fetch(`${FD_BASE}/competitions/WC/matches?season=2026`, {
      headers: { 'X-Auth-Token': API_KEY },
      next: { revalidate: 60 },
    });

    if (!res.ok) {
      return NextResponse.json({ fixtures: ALL_FIXTURES, source: 'static_fallback' });
    }

    const data = await res.json();

    // Map football-data.org response shape onto our WCMatch type
    const fixtures = (data.matches ?? []).map((m: any) => ({
      id: m.id,
      utcDate: m.utcDate,
      status: m.status,
      stage: m.stage,
      group: m.group ? `Group ${m.group}` : undefined,
      matchday: m.matchday,
      homeTeam: {
        name: m.homeTeam.name,
        shortName: m.homeTeam.shortName ?? m.homeTeam.name,
        crest: m.homeTeam.crest ?? '',
        tla: m.homeTeam.tla ?? '',
      },
      awayTeam: {
        name: m.awayTeam.name,
        shortName: m.awayTeam.shortName ?? m.awayTeam.name,
        crest: m.awayTeam.crest ?? '',
        tla: m.awayTeam.tla ?? '',
      },
      score: {
        fullTime: m.score?.fullTime ?? { home: null, away: null },
        halfTime: m.score?.halfTime ?? { home: null, away: null },
      },
      venue: m.venue ?? '',
      city: '',
      country: 'USA' as const,
    }));

    return NextResponse.json({ fixtures, source: 'live' });
  } catch {
    return NextResponse.json({ fixtures: ALL_FIXTURES, source: 'static_fallback' });
  }
}
