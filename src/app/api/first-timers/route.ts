import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';
import { Prisma } from '@/generated/client';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const unassignedOnly = searchParams.get('unassigned') === 'true';

    const session = await getServerSession();
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const where: Prisma.FirstTimerWhereInput = {};
    if (unassignedOnly) {
      where.assignedToId = null;
    }

    // Role-based filtering: members only see theirs (unless unassigned check is active)
    if (session.role === 'MEMBER' && !unassignedOnly) {
      where.assignedToId = session.userId as string;
    }

    const firstTimers = await prisma.firstTimer.findMany({
      where,
      orderBy: { visitDate: 'desc' }
    });

    return NextResponse.json(firstTimers);
  } catch (error) {
    console.error('FirstTimers API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
