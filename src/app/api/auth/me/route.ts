import { NextRequest, NextResponse } from 'next/server';
import { getSession, signToken } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { Role } from '@/types';

export async function GET(request: NextRequest) {
  try {
    const session = await getSession(request);

    if (!session) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const userModel = prisma.user;
    const user = await userModel.findUnique({
      where: { id: session.userId as string },
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
      }
    });

    if (!user) {
      return NextResponse.json({ user: null }, { status: 200 });
    }

    const response = NextResponse.json({ user });

    // If the role in the database is different from the role in the session token,
    // we need to refresh the token to keep the middleware in sync.
    if (user.role !== session.role) {
      const newToken = await signToken({ userId: user.id, role: user.role as Role });
      response.cookies.set('auth', newToken, { 
        httpOnly: true, 
        path: '/', 
        maxAge: 60 * 60 * 24 * 7 
      });
    }

    return response;
  } catch (error) {
    console.error('Session API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
