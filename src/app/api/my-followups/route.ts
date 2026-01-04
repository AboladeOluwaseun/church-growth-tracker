import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession(request as any);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const followUps = await (prisma as any).followUp.findMany({
      where: { userId: session.userId },
      include: {
        firstTimer: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(followUps);
  } catch (error) {
    console.error('My FollowUps API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
