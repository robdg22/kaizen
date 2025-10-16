export default function middleware(request: Request) {
  // Get the password from environment variables
  const sitePassword = process.env.SITE_PASSWORD
  
  // If no password is set, allow access (for development)
  if (!sitePassword) {
    return new Response(null, { status: 200 })
  }

  const url = new URL(request.url)
  
  // Always allow access to login page, API endpoints, and static assets
  if (url.pathname === '/login' || 
      url.pathname.startsWith('/api/') ||
      url.pathname.startsWith('/assets/') || 
      url.pathname.startsWith('/_next/') ||
      url.pathname === '/favicon.ico' ||
      url.pathname === '/vite.svg') {
    return new Response(null, { status: 200 })
  }

  // Check if user is already authenticated
  const authCookie = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('site-auth='))
  const isAuthenticated = authCookie?.split('=')[1] === 'authenticated'

  // If authenticated, allow access
  if (isAuthenticated) {
    return new Response(null, { status: 200 })
  }

  // If not authenticated and not on login page, redirect to login
  return new Response(null, {
    status: 302,
    headers: {
      'Location': '/login'
    }
  })
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
