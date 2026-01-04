import { SignJWT, jwtVerify } from 'jose';
import { NextRequest, NextResponse } from 'next/server';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_at_least_32_characters_long'
);

export async function signToken(payload: any) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

export async function verifyToken(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload;
  } catch (err) {
    console.error('JWT Verify Error:', err);
    return null;
  }
}

export async function getSession(req: NextRequest) {
  const token = req.cookies.get('auth')?.value;
  if (!token) return null;
  return await verifyToken(token);
}

export async function getServerSession() {
  const { cookies } = await import('next/headers');
  const token = cookies().get('auth')?.value;
  if (!token) return null;
  return await verifyToken(token);
}
