import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PATHS = ['/dashboard'];
const MOCK_SESSION_COOKIE = 'podcast-crm-session';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Check if the path needs protection
  const isProtected = PROTECTED_PATHS.some((path) => pathname.startsWith(path));

  if (!isProtected) {
    return NextResponse.next();
  }

  // Check for session cookie (mock auth in dev)
  const sessionCookie = request.cookies.get(MOCK_SESSION_COOKIE);

  // In development, also check for the Authorization header or auto-allow
  // For the demo, we auto-allow access (no real auth required to view the showcase)
  const isDevelopment = process.env.NODE_ENV !== 'production';

  if (!sessionCookie && !isDevelopment) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('redirect', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Security headers are set in next.config.ts via the headers() function
  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files and api routes
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
