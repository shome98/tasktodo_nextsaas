// File: middleware.ts
import { NextRequest, NextResponse } from 'next/server';
import { getToken } from 'next-auth/jwt';

const publicPaths = [
  '/login',
  '/register',
  '/api/auth/register',
  '/api/auth/[...nextauth]'
];

const isPublicPath = (pathname: string) => {
  return publicPaths.some(path => 
    pathname === path || 
    (path.includes('[...nextauth]') && pathname.startsWith('/api/auth'))
  );
};

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const secret = process.env.NEXTAUTH_SECRET;

  // Get the token from the request
  const token = await getToken({ 
    req: request, 
    secret,
    cookieName: 'next-auth.session-token'
  });

  // Handle API routes
  if (pathname.startsWith('/api')) {
    if (isPublicPath(pathname)) {
      return NextResponse.next();
    }

    if (!token) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    // Add user info to headers for API routes
    const requestHeaders = new Headers(request.headers);
    requestHeaders.set('user-id', token.id as string);
    requestHeaders.set('user-role', token.role as string);

    return NextResponse.next({
      request: {
        headers: requestHeaders,
      },
    });
  }

  // Handle page routes
  if (isPublicPath(pathname)) {
    // If user is authenticated and trying to access login/register, redirect to home
    if (token) {
      return NextResponse.redirect(new URL('/', request.url));
    }
    return NextResponse.next();
  }

  // Protected routes - redirect to login if not authenticated
  if (!token) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/api/((?!_next/static|_next/image|favicon.ico).*)',
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};