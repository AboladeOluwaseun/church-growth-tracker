import { NextResponse } from 'next/server';
import { getRecentActivities } from '@/lib/db';
import { getServerSession } from '@/lib/auth';

export async function GET() {
  const session = await getServerSession();
  
  if (!session || session.role !== 'ADMIN') {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  try {
    const activities = await getRecentActivities();
    return NextResponse.json(activities);
  } catch (error) {
    console.error('Failed to fetch activities:', error);
    return NextResponse.json({ error: 'Failed to fetch activities' }, { status: 500 });
  }
}
