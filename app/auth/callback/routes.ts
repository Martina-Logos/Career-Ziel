// app/auth/callback/route.ts
// Supabase redirects here after the user clicks the verification link in their email.
// This exchanges the one-time code for a real session, then sends the user to onboarding.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)
  const code = searchParams.get('code')
  // Where to send the user after verification — default to onboarding
  const next = searchParams.get('next') ?? '/onboarding'

  if (code) {
    const cookieStore = await cookies()

    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        cookies: {
          getAll() { return cookieStore.getAll() },
          setAll(cookiesToSet) {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          },
        },
      }
    )

    const { error } = await supabase.auth.exchangeCodeForSession(code)

    if (!error) {
      // Verified and session is set — send to onboarding (first time)
      // or dashboard if they've already completed onboarding
      return NextResponse.redirect(`${origin}${next}`)
    }
  }

  // Something went wrong — send to an error page
  return NextResponse.redirect(`${origin}/auth/auth-error`)
}