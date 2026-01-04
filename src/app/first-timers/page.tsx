import { getFirstTimers } from '@/lib/db';
import FirstTimerList from '@/components/FirstTimerList';
import { Users } from 'lucide-react';
import { getSession } from '@/lib/auth';
import { headers } from 'next/headers';

export const metadata = {
  title: 'Directory | Feeding Centre',
};

export default async function FirstTimersPage() {
  const session = await getSession({ cookies: { get: (name: string) => require('next/headers').cookies().get(name) } } as any) as any;
  const firstTimers = await getFirstTimers();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight flex items-center gap-2">
            <Users size={24} className="text-primary" />
            Guest Directory
          </h1>
          <p className="text-muted-foreground mt-1">Search and manage all visitors recorded in the system.</p>
        </div>
      </div>

      <FirstTimerList initialData={firstTimers} userRole={session?.role} userId={session?.userId} />
    </div>
  );
}
