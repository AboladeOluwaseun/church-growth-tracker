import { prisma } from './prisma';
import { FirstTimer } from '@/types';
import { Prisma } from '../generated/client';

export async function getFirstTimers(userId?: string): Promise<FirstTimer[]> {
  const where: Prisma.FirstTimerWhereInput = {};
  if (userId) {
    where.assignedToId = userId;
  }
  
  const firstTimers = await prisma.firstTimer.findMany({
    where,
    orderBy: { visitDate: 'desc' }
  });
  return firstTimers as unknown as FirstTimer[];
}

export async function getFirstTimer(id: string): Promise<FirstTimer | undefined> {
  const firstTimer = await prisma.firstTimer.findUnique({
    where: { id }
  });
  return (firstTimer as unknown as FirstTimer) || undefined;
}

export async function addFirstTimer(data: Omit<FirstTimer, 'id'>): Promise<FirstTimer> {
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
