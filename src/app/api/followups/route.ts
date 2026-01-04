import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstTimerId, notes } = await request.json();

    if (!firstTimerId) {
      return NextResponse.json({ error: 'First Timer ID is required' }, { status: 400 });
    }

    const followUp = await prisma.followUp.create({
      data: {
        userId: session.userId as string,
        firstTimerId: firstTimerId as string,
        notes: notes as string,
      },
      include: {
        user: {
          select: { name: true }
        }
      }
    });

    return NextResponse.json(followUp);
  } catch (error: unknown) {
    console.error('Follow-up API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { searchParams } = new URL(request.url);
    const firstTimerId = searchParams.get('firstTimerId');

    if (!firstTimerId) {
      return NextResponse.json({ error: 'First Timer ID is required' }, { status: 400 });
    }

    const followUps = await prisma.followUp.findMany({
      where: { firstTimerId },
      include: {
        user: {
          select: { name: true, email: true }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(followUps);
  } catch (error: unknown) {
    console.error('Follow-up fetch error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
