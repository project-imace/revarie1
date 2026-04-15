import { NextResponse } from 'next/server';

export function proxy(request) {
  const sessionCookie = request.cookies.get('participantId');
  const isLoggedIn = !!sessionCookie?.value;
  const path = request.nextUrl.pathname;

  const isLoginPage = path === '/';
  const isProtectedRoute = path !== '/' && !path.startsWith('/api');

  if (isProtectedRoute && !isLoggedIn) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (isLoginPage && isLoggedIn) {
    const participantId = sessionCookie.value;
    return NextResponse.redirect(new URL(`/dashboard`, request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/', '/dashboard', '/pre-survey', '/post-survey', '/session', '/self-reflection'],
};
