import { SignJWT, jwtVerify, JWTPayload } from 'jose';
import { NextRequest } from 'next/server';
import { Role } from '@/types';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'default_secret_at_least_32_characters_long'
);

interface SessionPayload extends JWTPayload {
  userId: string;
  role: Role;
}

export async function signToken(payload: { userId: string, role: Role }) {
  const token = await new SignJWT(payload)
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime('7d')
    .sign(JWT_SECRET);
  return token;
}

export async function verifyToken(token: string): Promise<SessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as SessionPayload;
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
  const cookieStore = cookies();
  const token = cookieStore.get('auth')?.value;
  if (!token) return null;
  return await verifyToken(token);
}
