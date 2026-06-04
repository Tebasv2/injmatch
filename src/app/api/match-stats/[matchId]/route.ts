import { NextResponse } from 'next/server';

const AF_BASE = 'https://v3.football.api-sports.io';
const API_KEY = process.env.API_FOOTBALL_KEY;

export const revalidate = 300; // cache 5 min

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ matchId: string }> },
) {
  const { matchId } = await params;

  if (!API_KEY) {
    return NextResponse.json({ error: 'API_FOOTBALL_KEY not configured' }, { status: 503 });
  }

  const res = await fetch(`${AF_BASE}/fixtures/players?fixture=${matchId}`, {
    headers: {
      'x-rapidapi-host': 'v3.football.api-sports.io',
      'x-rapidapi-key': API_KEY,
    },
    next: { revalidate: 300 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: `API-Football error: ${res.status}` }, { status: res.status });
  }

  const data = await res.json();
  return NextResponse.json(data);
}
