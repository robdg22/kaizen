export default function middleware(request: Request) {
  // For now, disable middleware to allow the app to load
  // We'll implement client-side protection instead
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
