import { prisma } from './prisma';
import { FirstTimer } from '@/types';

export async function getFirstTimers(): Promise<FirstTimer[]> {
  const firstTimers = await prisma.firstTimer.findMany({
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

export async function getWeeklyReportData() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateString = sevenDaysAgo.toISOString().split('T')[0];

  const thisWeekGuests = await prisma.firstTimer.findMany({
    where: {
      visitDate: {
        gte: dateString
      }
    },
    orderBy: { visitDate: 'desc' }
  });

  const total = thisWeekGuests.length;
  const byStatus = {
    New: thisWeekGuests.filter((g: any) => g.status === 'New').length,
    Contacted: thisWeekGuests.filter((g: any) => g.status === 'Contacted').length,
    Visited: thisWeekGuests.filter((g: any) => g.status === 'Visited').length,
    Integrated: thisWeekGuests.filter((g: any) => g.status === 'Integrated').length,
  };

  const prayerRequests = thisWeekGuests
    .filter((g: any) => g.prayerRequest)
    .map((g: any) => ({
      name: `${g.firstName} ${g.lastName}`,
      request: g.prayerRequest
    }));

  return {
    total,
    byStatus,
    prayerRequests,
    guests: thisWeekGuests as unknown as FirstTimer[]
  };
}
