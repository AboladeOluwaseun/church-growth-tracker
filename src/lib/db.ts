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
