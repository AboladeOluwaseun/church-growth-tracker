'use server';

import { addFirstTimer, updateFirstTimer } from '@/lib/db';
import { redirect } from 'next/navigation';
import { FirstTimer } from '@/types';

import { revalidatePath } from 'next/cache';

export async function submitFirstTimer(formData: FormData) {

  const data: Omit<FirstTimer, 'id'> = {
    firstName: formData.get('firstName') as string,
    lastName: formData.get('lastName') as string,
    phone: formData.get('phone') as string,
    address: formData.get('address') as string,
    visitDate: formData.get('visitDate') as string || new Date().toISOString().split('T')[0],
    prayerRequest: formData.get('prayerRequest') as string,
    notes: formData.get('notes') as string,
    status: 'New',
  };

  await addFirstTimer(data);
  revalidatePath('/first-timers');
  redirect('/first-timers');
}

export async function updateStatus(id: string, newStatus: FirstTimer['status']) {
  await updateFirstTimer(id, { status: newStatus });
  revalidatePath(`/first-timers/${id}`);
  revalidatePath('/first-timers');
  revalidatePath('/');
}
