'use client'
// hooks/useUser.ts
// Use this in any Client Component that needs the current user's profile.
// Returns the full users table row — name, role, plan, streak, etc.
// Returns null while loading, and null if not authenticated.

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import type { Database } from '@/lib/supabase/types'

export type UserProfile = Database['public']['Tables']['users']['Row']

interface UseUserResult {
  user: UserProfile | null
  loading: boolean
  error: string | null
  refetch: () => void
}

export function useUser(): UseUserResult {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [tick, setTick] = useState(0)

  const refetch = () => setTick(t => t + 1)

  useEffect(() => {
    let cancelled = false

    async function load() {
      setLoading(true)
      setError(null)

      const supabase = createClient()

      // Get auth session
      const { data: { user: authUser }, error: authError } = await supabase.auth.getUser()

      if (authError || !authUser) {
        if (!cancelled) { setUser(null); setLoading(false) }
        return
      }

      // Get profile row from users table
      const { data, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authUser.id)
        .single()

      if (!cancelled) {
        if (profileError) {
          setError(profileError.message)
          setUser(null)
        } else {
          setUser(data)
        }
        setLoading(false)
      }
    }

    load()
    return () => { cancelled = true }
  }, [tick])

  return { user, loading, error, refetch }
}

// Lightweight hook — just the auth session user (no DB call)
// Use when you only need email / id, not the full profile
export function useAuthUser() {
  const [authUser, setAuthUser] = useState<{ id: string; email: string } | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const supabase = createClient()
    supabase.auth.getUser().then(({ data: { user } }) => {
      setAuthUser(user ? { id: user.id, email: user.email ?? '' } : null)
      setLoading(false)
    })
  }, [])

  return { authUser, loading }
}