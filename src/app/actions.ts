'use server';

import { addFirstTimer, updateFirstTimer } from '@/lib/db';
import { redirect } from 'next/navigation';
import { FirstTimer } from '@/types';

import { revalidatePath } from 'next/cache';
import { getServerSession } from '@/lib/auth';

export async function submitFirstTimer(formData: FormData) {
  const session = await getServerSession();
  const isMember = session?.role === 'MEMBER';

  const data: Omit<FirstTimer, 'id'> & { assignedToId?: string } = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    visitDate: formData.get('visitDate') as string || new Date().toISOString().split('T')[0],
    prayerRequest: formData.get('prayerRequest') as string,
    notes: formData.get('notes') as string,
    status: 'New',
    isHandedOver: false,
    assignedToId: formData.get('assignedToId') as string || session?.userId,
  };

  await addFirstTimer(data);
  revalidatePath('/first-timers');
  revalidatePath('/admin');
  revalidatePath('/');
  redirect('/first-timers');
}

export async function updateStatus(id: string, newStatus: FirstTimer['status']) {
  await updateFirstTimer(id, { status: newStatus });
  revalidatePath(`/first-timers/${id}`);
  revalidatePath('/first-timers');
  revalidatePath('/');
}
