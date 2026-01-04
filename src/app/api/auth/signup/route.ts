import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';
import { Role } from '@/types';

export async function POST(request: NextRequest) {
  try {
    const { email, password, name } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Email and password required' }, { status: 400 });
    }

    const userModel = prisma.user;
    const existing = await userModel.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await userModel.create({
      data: { email, password: hashedPassword, name },
    });

    const token = await signToken({ userId: user.id, role: user.role as Role });

    const response = NextResponse.json({ message: 'User created' }, { status: 201 });
    response.cookies.set('auth', token, { httpOnly: true, path: '/', maxAge: 60 * 60 * 24 * 7 });
    return response;
  } catch (err: unknown) {
    console.error('Signup error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
