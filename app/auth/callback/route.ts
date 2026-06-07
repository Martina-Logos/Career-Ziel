// app/auth/callback/route.ts
// Handles Supabase email confirmation via token_hash (no PKCE verifier needed).
// This works cross-browser and cross-device reliably.

import { createServerClient } from '@supabase/ssr'
import { cookies } from 'next/headers'
import { NextResponse, type NextRequest } from 'next/server'
import { type EmailOtpType } from '@supabase/supabase-js'

export async function GET(request: NextRequest) {
  const { searchParams, origin } = new URL(request.url)

  // Supabase email links contain token_hash + type
  const token_hash = searchParams.get('token_hash')
  const type       = searchParams.get('type') as EmailOtpType | null
  const next       = searchParams.get('next') ?? '/profile-setup'

  // Also handle legacy PKCE code param just in case
  const code = searchParams.get('code')

  const cookieStore = await cookies()

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() { return cookieStore.getAll() },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            )
          } catch { /* Server Component — safe to ignore */ }
        },
      },
    }
  )

  let userId: string | undefined

  // ── Primary path: token_hash (what Supabase sends in confirmation emails)
  if (token_hash && type) {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash,
      type,
    })
    if (error) {
      console.error('[callback] verifyOtp failed:', error.message)
    } else {
      userId = data.session?.user?.id ?? data.user?.id
    }
  }

  // ── Fallback: PKCE code (only works same-browser)
  if (!userId && code) {
    const { data, error } = await supabase.auth.exchangeCodeForSession(code)
    if (error) {
      console.error('[callback] exchangeCodeForSession failed:', error.message)
    } else {
      userId = data.session?.user?.id
    }
  }

  if (!userId) {
    console.error('[callback] Could not verify user — redirecting to error page')
    return NextResponse.redirect(`${origin}/auth/auth-error`)
  }

  // Check if profile already complete → skip setup
  const { data: profile } = await supabase
    .from('users')
    .select('target_role')
    .eq('id', userId)
    .single()

  if (profile?.target_role) {
    return NextResponse.redirect(`${origin}/dashboard`)
  }

  return NextResponse.redirect(`${origin}${next}`)
}