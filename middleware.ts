export default function middleware(request: Request) {
  // Get the password from environment variables
  const sitePassword = process.env.SITE_PASSWORD
  
  // If no password is set, allow access (for development)
  if (!sitePassword) {
    return new Response(null, { status: 200 })
  }

  // Check if user is already authenticated
  const authCookie = request.headers.get('cookie')?.split(';').find(c => c.trim().startsWith('site-auth='))
  const isAuthenticated = authCookie?.split('=')[1] === 'authenticated'

  // If authenticated, allow access
  if (isAuthenticated) {
    return new Response(null, { status: 200 })
  }

  // Check if this is a login attempt
  const url = new URL(request.url)
  if (url.pathname === '/login' && request.method === 'POST') {
    return request.formData().then(data => {
      const password = data.get('password')
      
      if (password === sitePassword) {
        // Create response and set auth cookie
        const response = new Response(null, {
          status: 302,
          headers: {
            'Location': '/',
            'Set-Cookie': 'site-auth=authenticated; HttpOnly; Secure; SameSite=Lax; Max-Age=604800; Path=/'
          }
        })
        return response
      } else {
        // Wrong password, redirect back to login with error
        const response = new Response(null, {
          status: 302,
          headers: {
            'Location': '/login?error=1'
          }
        })
        return response
      }
    })
  }

  // If not authenticated and not on login page, redirect to login
  if (url.pathname !== '/login') {
    return new Response(null, {
      status: 302,
      headers: {
        'Location': '/login'
      }
    })
  }

  return new Response(null, { status: 200 })
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
