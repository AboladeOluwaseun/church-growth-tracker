import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const PROTECTED_ROUTES = ['/', '/first-timers', '/reports', '/admin'];
const ADMIN_ROUTES = ['/admin'];
const AUTH_ROUTES = ['/auth/login', '/auth/signup'];

export async function middleware(req: NextRequest) {
  const path = req.nextUrl.pathname;

  // Check if it's an auth route (login/signup)
  const isAuthRoute = AUTH_ROUTES.some(route => path.startsWith(route));
  
  // Check if it's a protected route
  const isProtected = PROTECTED_ROUTES.some(route => 
    path === route || path.startsWith(`${route}/`)
  );

  // Skip middleware for static files and standard Next.js paths
  if (path.startsWith('/api/') || path.includes('.')) {
    return NextResponse.next();
  }

  const token = req.cookies.get('auth')?.value;
  const payload = token ? await verifyToken(token) : null;

  // Redirect authenticated users away from auth routes
  if (isAuthRoute && payload) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  // Handle protected routes
  if (isProtected && !payload) {
    const url = new URL('/auth/login', req.url);
    url.searchParams.set('callbackUrl', path);
    return NextResponse.redirect(url);
  }

  // Admin route protection
  const isAdminRoute = ADMIN_ROUTES.some(route => path.startsWith(route));
  if (isAdminRoute && payload?.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
};
