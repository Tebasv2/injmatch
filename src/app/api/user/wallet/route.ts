import { NextRequest, NextResponse } from 'next/server';
import { auth } from '@/auth';
import { prisma } from '@/lib/prisma';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ walletAddress: null });

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { walletAddress: true },
  });
  return NextResponse.json({ walletAddress: user?.walletAddress ?? null });
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { walletAddress } = await req.json();
  if (!walletAddress || typeof walletAddress !== 'string') {
    return NextResponse.json({ error: 'Invalid wallet address' }, { status: 400 });
  }

  try {
    const user = await prisma.user.update({
      where: { id: session.user.id },
      data: { walletAddress },
      select: { walletAddress: true },
    });
    return NextResponse.json({ walletAddress: user.walletAddress });
  } catch {
    return NextResponse.json({ error: 'Wallet already linked to another account' }, { status: 409 });
  }
}

export async function DELETE() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await prisma.user.update({
    where: { id: session.user.id },
    data: { walletAddress: null },
  });
  return NextResponse.json({ ok: true });
}
