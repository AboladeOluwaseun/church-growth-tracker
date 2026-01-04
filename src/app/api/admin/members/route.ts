import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession();
    if (!session || session.role !== 'ADMIN') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userModel = prisma.user;
    const members = await userModel.findMany({
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
  } catch (error: unknown) {
    console.error('Admin API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
