import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstTimerId } = await request.json();

    if (!firstTimerId) {
      return NextResponse.json({ error: 'First Timer ID is required' }, { status: 400 });
    }

    const updated = await prisma.firstTimer.update({
      where: { id: firstTimerId },
      data: {
        isHandedOver: true,
        status: 'Integrated',
      }
    });

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Handover API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
