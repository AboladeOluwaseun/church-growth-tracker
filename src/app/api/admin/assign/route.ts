import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const session = await getSession(request as any);

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const { firstTimerId, userId } = await request.json();

    if (!firstTimerId || !userId) {
      return NextResponse.json({ error: 'FirstTimerId and UserId are required' }, { status: 400 });
    }

    const updated = await (prisma as any).firstTimer.update({
      where: { id: firstTimerId },
      data: { assignedToId: userId },
    });

    return NextResponse.json(updated);
  } catch (error) {
    console.error('Assign API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
