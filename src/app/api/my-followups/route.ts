import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const followUps = await prisma.followUp.findMany({
      where: { userId: session.userId as string },
      include: {
        firstTimer: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(followUps);
  } catch (error: unknown) {
    console.error('My FollowUps API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
