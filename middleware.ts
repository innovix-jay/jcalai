import { NextRequest, NextResponse } from 'next/server'
import { createServerClient } from '@supabase/ssr'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  // Get environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  // If env vars are missing, allow the request through (for static pages, test pages, etc.)
  if (!supabaseUrl || !supabaseAnonKey) {
    console.warn('[Middleware] Supabase env vars not found, allowing request through:', req.nextUrl.pathname)
    return res
  }

  const supabase = createServerClient(
    supabaseUrl,
    supabaseAnonKey,
    {
      cookies: {
        getAll() {
          return req.cookies.getAll()
        },
        setAll(cookiesToSet) {
          cookiesToSet.forEach(({ name, value, options }) => {
            res.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  const { pathname } = req.nextUrl

  // Allow the OAuth callback to proceed without interference
  if (pathname.startsWith('/auth/callback')) {
    return res
  }

  // Refresh and read the auth session for gating decisions
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const isAuthRoute = pathname.startsWith('/auth')
  const isProtectedRoute = pathname.startsWith('/dashboard') || pathname.startsWith('/builder')

  // If visiting auth pages while logged in, send to dashboard
  if (isAuthRoute && user) {
    const url = new URL('/dashboard', req.url)
    return NextResponse.redirect(url)
  }

  // Protect dashboard and builder for unauthenticated users
  if (isProtectedRoute && !user) {
    const url = new URL('/auth/login', req.url)
    return NextResponse.redirect(url)
  }

  // UX: if user is logged in and visits home, send to dashboard
  if (pathname === '/' && user) {
    const url = new URL('/dashboard', req.url)
    return NextResponse.redirect(url)
  }

  return res
}

export const config = {
  matcher: [
    // Skip Next.js internals and static files, handle everything else
    '/((?!_next/static|_next/image|favicon.ico|robots.txt|sitemap.xml|api).*)',
  ],
}
