import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  // Get the password from environment variables
  const sitePassword = process.env.SITE_PASSWORD
  
  // If no password is set, allow access (for development)
  if (!sitePassword) {
    return NextResponse.next()
  }

  // Check if user is already authenticated
  const authCookie = request.cookies.get('site-auth')
  const isAuthenticated = authCookie?.value === 'authenticated'

  // If authenticated, allow access
  if (isAuthenticated) {
    return NextResponse.next()
  }

  // Check if this is a login attempt
  const url = new URL(request.url)
  if (url.pathname === '/login' && request.method === 'POST') {
    const formData = request.formData()
    return formData.then(data => {
      const password = data.get('password')
      
      if (password === sitePassword) {
        // Create response and set auth cookie
        const response = NextResponse.redirect(new URL('/', request.url))
        response.cookies.set('site-auth', 'authenticated', {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
          maxAge: 60 * 60 * 24 * 7, // 7 days
          path: '/'
        })
        return response
      } else {
        // Wrong password, redirect back to login with error
        return NextResponse.redirect(new URL('/login?error=1', request.url))
      }
    })
  }

  // If not authenticated and not on login page, redirect to login
  if (url.pathname !== '/login') {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - assets (static assets)
     */
    '/((?!api|_next/static|_next/image|favicon.ico|assets).*)',
  ],
}
