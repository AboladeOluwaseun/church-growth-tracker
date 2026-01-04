import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { prisma } from '@/lib/prisma';
import { signToken } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    const user = await (prisma as any).user.findUnique({
      where: { email },
    });

    if (!user) {
      console.log('Login failed: User not found', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    console.log('User found, comparing passwords...');
    const isBcryptHash = user.password.startsWith('$2');
    let isPasswordValid = false;

    if (isBcryptHash) {
      isPasswordValid = await bcrypt.compare(password, user.password);
    } else {
      isPasswordValid = password === user.password;
    }
    
    console.log('Password valid:', isPasswordValid, '(isBcryptHash:', isBcryptHash, ')');

    if (!isPasswordValid) {
      console.log('Login failed: Invalid password for', email);
      return NextResponse.json(
        { error: 'Invalid credentials' },
        { status: 401 }
      );
    }

    const token = await signToken({ userId: user.id, role: user.role });

    const response = NextResponse.json(
      { 
        message: 'Logged in successfully',
        user: { id: user.id, email: user.email, name: user.name, role: user.role }
      },
      { status: 200 }
    );

    // Set HTTP-only cookie for session
    response.cookies.set('auth', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      path: '/',
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
