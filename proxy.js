import { NextResponse } from 'next/server';
import { verifyToken } from './lib/session';

export async function proxy(request) {
  const sessionCookie = request.cookies.get('participantId');
  const participantId = await verifyToken(sessionCookie?.value);
  const isLoggedIn = !!participantId;
  const path = request.nextUrl.pathname;

  const isLoginPage = path === '/';
  const isProtectedRoute = path !== '/' && !path.startsWith('/api');

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isLoginPage && isLoggedIn) {
    return NextResponse.redirect(new URL(`${process.env.NEXT_PUBLIC_BASE_PATH}/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/pre-survey', '/post-survey', '/session', '/self-reflection'],
};
