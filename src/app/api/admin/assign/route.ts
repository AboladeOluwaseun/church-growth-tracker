import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from '@/lib/auth';

export async function POST(req: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstTimerId, userId } = await req.json();

    if (!firstTimerId || !userId) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const { assignFirstTimer } = await import('@/lib/db');
    const updated = await assignFirstTimer(firstTimerId, userId);

    return NextResponse.json(updated);
  } catch (error: unknown) {
    console.error('Assign API error:', error);
    return NextResponse.json({ error: error instanceof Error ? error.message : 'Internal Server Error' }, { status: 500 });
  }
}
