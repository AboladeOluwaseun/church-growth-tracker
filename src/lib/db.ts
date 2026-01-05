import { prisma } from './prisma';
import { FirstTimer } from '@/types';
import { Prisma } from '../generated/client';

export async function getFirstTimers(userId?: string, includeHandedOver = false): Promise<FirstTimer[]> {
  const where: Prisma.FirstTimerWhereInput = {};
  
  if (!includeHandedOver) {
    where.isHandedOver = false;
  }

  if (userId) {
    where.assignedToId = userId;
  }
  
  const firstTimers = await prisma.firstTimer.findMany({
    where,
    include: {
      attendances: true,
      followUps: true,
      assignedTo: {
        select: { name: true }
      }
    },
    orderBy: { visitDate: 'desc' }
  });
  return firstTimers as unknown as FirstTimer[];
}

export async function getFirstTimer(id: string): Promise<FirstTimer | undefined> {
  const firstTimer = await prisma.firstTimer.findUnique({
    where: { id },
    include: {
      attendances: true,
      followUps: {
        include: {
          user: {
            select: { name: true }
          }
        },
        orderBy: { createdAt: 'desc' }
      }
    }
  });
  return (firstTimer as unknown as FirstTimer) || undefined;
}

export async function addFirstTimer(data: Omit<FirstTimer, 'id'> & { assignedToId?: string }): Promise<FirstTimer> {
  const newTimer = await prisma.firstTimer.create({
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      visitDate: data.visitDate,
      prayerRequest: data.prayerRequest,
      notes: data.notes,
      status: data.status,
      assignedToId: data.assignedToId,
    }
  });
  return newTimer as unknown as FirstTimer;
}

export async function updateFirstTimer(id: string, data: Partial<FirstTimer>): Promise<FirstTimer | null> {
  const updated = await prisma.firstTimer.update({
    where: { id },
    data: {
      firstName: data.firstName,
      lastName: data.lastName,
      phone: data.phone,
      address: data.address,
      visitDate: data.visitDate,
      prayerRequest: data.prayerRequest,
      notes: data.notes,
      status: data.status,
    }
  });
  return updated as unknown as FirstTimer;
}

export async function getWeeklyReportData(userId?: string) {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateString = sevenDaysAgo.toISOString().split('T')[0];

  const where: Prisma.FirstTimerWhereInput = {
    visitDate: {
      gte: dateString
    }
  };

  if (userId) {
    where.assignedToId = userId;
  }

  const thisWeekGuests = await prisma.firstTimer.findMany({
    where,
    orderBy: { visitDate: 'desc' }
  });

  const total = thisWeekGuests.length;
  const byStatus = {
    New: thisWeekGuests.filter((g) => g.status === 'New').length,
    Contacted: thisWeekGuests.filter((g) => g.status === 'Contacted').length,
    Visited: thisWeekGuests.filter((g) => g.status === 'Visited').length,
    Integrated: thisWeekGuests.filter((g) => g.status === 'Integrated').length,
  };

  const prayerRequests = thisWeekGuests
    .filter((g) => g.prayerRequest)
    .map((g) => ({
      name: `${g.firstName} ${g.lastName}`,
      request: g.prayerRequest as string
    }));

  return {
    total,
    byStatus,
    prayerRequests,
    guests: thisWeekGuests as unknown as FirstTimer[]
  };
}
export async function assignFirstTimer(firstTimerId: string, userId: string): Promise<FirstTimer | null> {
  const updated = await prisma.firstTimer.update({
    where: { id: firstTimerId },
    data: {
      assignedTo: { connect: { id: userId } },
      status: 'Contacted'
    }
  });
  return updated as unknown as FirstTimer;
}

export async function markAttendance(firstTimerId: string, date: string | Date, userId?: string) {
  const attendanceDate = typeof date === 'string' ? new Date(date) : date;
  return await prisma.attendance.create({
    data: {
      firstTimerId,
      date: attendanceDate,
      userId
    }
  });
}

export async function handOverFirstTimer(firstTimerId: string) {
  return await prisma.firstTimer.update({
    where: { id: firstTimerId },
    data: {
      isHandedOver: true,
      status: 'Integrated'
    }
  });
}

export async function getAttendance(firstTimerId: string) {
  return await prisma.attendance.findMany({
    where: { firstTimerId },
    orderBy: { date: 'asc' }
  });
}
export async function getRecentActivities(limit = 20) {
  const [followUps, attendances] = await Promise.all([
    prisma.followUp.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        firstTimer: { select: { firstName: true, lastName: true } }
      }
    }),
    prisma.attendance.findMany({
      take: limit,
      orderBy: { createdAt: 'desc' },
      include: {
        user: { select: { name: true } },
        firstTimer: { select: { firstName: true, lastName: true } }
      }
    })
  ]);

  // Combine and sort
  const activities = [
    ...followUps.map(f => ({ ...f, activityType: 'FOLLOW_UP' })),
    ...attendances.map(a => ({ 
        id: a.id,
        type: 'ATTENDANCE', // Custom type field
        notes: `Marked attendance for ${a.date.toLocaleDateString()}`,
        createdAt: a.createdAt,
        user: a.user,
        firstTimer: a.firstTimer,
        activityType: 'ATTENDANCE'
    }))
  ];

  return activities
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, limit);
}

export async function getAllUsers() {
  return await prisma.user.findMany({
    select: {
      id: true,
      name: true,
      role: true,
    },
    orderBy: { name: 'asc' }
  });
}
