import { createMiddlewareClient } from '@supabase/auth-helpers-nextjs'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Create a Supabase client configured to use cookies
  const supabase = createMiddlewareClient({ req, res })
  
  // Refresh session if expired - required for Server Components
  const { data: { session } } = await supabase.auth.getSession()
  
  // Define protected API routes
  const protectedApiRoutes = [
    '/api/chat',
    '/api/image',
    '/api/test-connection'
  ]
  
  // Check if the request is to a protected API route
  const isProtectedApiRoute = protectedApiRoutes.some(route => 
    req.nextUrl.pathname.startsWith(route)
  )
  
  // If accessing a protected API route without authentication
  if (isProtectedApiRoute && !session) {
    return NextResponse.json(
      { 
        error: 'Unauthorized', 
        message: 'Authentication required to access this resource' 
      }, 
      { status: 401 }
    )
  }
  
  // Add user context to request headers for API routes
  if (session && isProtectedApiRoute) {
    res.headers.set('x-user-id', session.user.id)
    res.headers.set('x-user-email', session.user.email || '')
  }
  
  return res
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - public folder
     */
    '/((?!_next/static|_next/image|favicon.ico|public).*)',
  ],
}
