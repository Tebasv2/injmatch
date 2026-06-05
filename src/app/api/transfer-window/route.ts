import { NextRequest, NextResponse } from 'next/server';

interface WindowState {
  open: boolean;
  round: number | null;
  reason: string;
  nextOpen?: string;
}

let cache: { value: WindowState; ts: number } | null = null;
let override: 'open' | 'closed' | null = null;

const CACHE_TTL = 5 * 60 * 1000;

async function computeWindow(): Promise<WindowState> {
  const apiKey = process.env.FOOTBALL_DATA_API_KEY;
  if (!apiKey) {
    return { open: true, round: null, reason: 'API key not configured — window open by default' };
  }

  const res = await fetch('https://api.football-data.org/v4/competitions/WC/matches', {
    headers: { 'X-Auth-Token': apiKey },
  });

  if (!res.ok) {
    return { open: true, round: null, reason: 'Failed to fetch match data — window open by default' };
  }

  const data = await res.json();
  const matches: any[] = data.matches ?? [];

  const byMatchday = new Map<number, any[]>();
  for (const m of matches) {
    const md: number = m.matchday;
    if (!byMatchday.has(md)) byMatchday.set(md, []);
    byMatchday.get(md)!.push(m);
  }

  const matchdays = [...byMatchday.keys()].sort((a, b) => a - b);

  let currentMatchday: number | null = null;
  for (const md of matchdays) {
    const group = byMatchday.get(md)!;
    if (group.some((m) => m.status === 'FINISHED')) {
      currentMatchday = md;
    }
  }

  if (currentMatchday === null) {
    return { open: true, round: null, reason: 'No matches have started yet' };
  }

  const currentGroup = byMatchday.get(currentMatchday)!;
  const allCurrentFinished = currentGroup.every((m) => m.status === 'FINISHED');

  if (!allCurrentFinished) {
    const inPlay = currentGroup.some((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED');
    const reason = inPlay
      ? `Round ${currentMatchday} is in progress`
      : `Round ${currentMatchday} has unfinished matches`;
    return { open: false, round: currentMatchday, reason };
  }

  const nextMatchday = matchdays.find((md) => md > currentMatchday!);
  if (nextMatchday !== undefined) {
    const nextGroup = byMatchday.get(nextMatchday)!;
    const nextActive = nextGroup.some((m) => m.status === 'IN_PLAY' || m.status === 'PAUSED');
    if (nextActive) {
      return { open: false, round: nextMatchday, reason: `Round ${nextMatchday} is already in progress` };
    }
  }

  return { open: true, round: currentMatchday, reason: `Round ${currentMatchday} complete — transfer window is open` };
}

async function getWindow(): Promise<WindowState> {
  if (override === 'open') {
    return { open: true, round: null, reason: 'Admin override: window forced open' };
  }
  if (override === 'closed') {
    return { open: false, round: null, reason: 'Admin override: window forced closed' };
  }

  if (cache && Date.now() - cache.ts < CACHE_TTL) {
    return cache.value;
  }

  const value = await computeWindow();
  cache = { value, ts: Date.now() };
  return value;
}

export async function GET() {
  try {
    const state = await getWindow();
    return NextResponse.json(state);
  } catch {
    return NextResponse.json({ open: true, round: null, reason: 'Error fetching window state — open by default' });
  }
}

export async function POST(req: NextRequest) {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret || req.headers.get('x-cron-secret') !== cronSecret) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await req.json();
  const { override: newOverride } = body as { override: 'open' | 'closed' | 'auto' };

  if (newOverride === 'auto') {
    override = null;
    cache = null;
    return NextResponse.json({ ok: true, override: null });
  }

  if (newOverride === 'open' || newOverride === 'closed') {
    override = newOverride;
    return NextResponse.json({ ok: true, override });
  }

  return NextResponse.json({ error: 'Invalid override value' }, { status: 400 });
}
