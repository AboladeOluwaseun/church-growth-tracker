import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSession } from '@/lib/auth';

export async function GET(request: Request) {
  try {
    const session = await getSession(request as any);

    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 403 });
    }

    const members = await prisma.user.findMany({
      where: { role: 'MEMBER' },
      include: {
        assignedItems: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            status: true,
            visitDate: true,
          }
        },
        followUps: {
          orderBy: { createdAt: 'desc' },
          take: 5,
          include: {
            firstTimer: {
              select: {
                firstName: true,
                lastName: true,
              }
            }
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(members);
  } catch (error) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
