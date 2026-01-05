import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstTimerId, date } = await request.json();

    if (!firstTimerId || !date) {
      return NextResponse.json({ error: 'First Timer ID and date are required' }, { status: 400 });
    }

    const attendance = await prisma.attendance.create({
      data: {
        firstTimerId,
        date: new Date(date),
      }
    });

    return NextResponse.json(attendance);
  } catch (error: unknown) {
    console.error('Attendance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { firstTimerId, date } = await request.json();

    if (!firstTimerId || !date) {
      return NextResponse.json({ error: 'First Timer ID and date are required' }, { status: 400 });
    }

    // Find and delete the attendance record for this person on this date
    // We need to match the date. Since we store specific dates (likely midnight UTC or local), 
    // we should be careful. Assuming the frontend sends the same ISO string or Date object.
    // Ideally, we search by range or ensure precise match.
    // For simplicity, let's look for a record with the exact date (ignoring time if possible, but Prisma DateTime is specific).
    // Let's assume the frontend sends the exact ISO string stored, or we match by day.

    const targetDate = new Date(date);
    const nextDay = new Date(targetDate);
    nextDay.setDate(nextDay.getDate() + 1);

    await prisma.attendance.deleteMany({
      where: {
        firstTimerId,
        date: {
          gte: targetDate,
          lt: nextDay
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error('Attendance API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
