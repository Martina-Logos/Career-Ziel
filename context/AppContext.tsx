'use client'

import { createContext, useContext, useState, useCallback, ReactNode } from 'react'
import { User, Session, JobDescription } from '@/types'

interface AppContextType {
  user: User | null
  setUser: (user: User | null) => void
  sessions: Session[]
  addSession: (session: Session) => void
  currentSession: Partial<Session> | null
  setCurrentSession: (session: Partial<Session> | null) => void
  jobDescriptions: JobDescription[]
  addJobDescription: (jd: JobDescription) => void
  removeJobDescription: (id: string) => void
  isAuthenticated: boolean
  logout: () => void
}

const AppContext = createContext<AppContextType | undefined>(undefined)

const MOCK_USER: User = {
  id: '1',
  name: 'Alex Mukasa',
  email: 'alex@example.com',
  currentRole: 'Software Developer',
  targetRole: 'Senior Software Engineer',
  industry: 'Technology',
  experienceLevel: 'mid',
  tier: 'free',
  streak: 4,
  totalSessions: 12,
  createdAt: new Date().toISOString(),
}

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [sessions, setSessions] = useState<Session[]>([])
  const [currentSession, setCurrentSession] = useState<Partial<Session> | null>(null)
  const [jobDescriptions, setJobDescriptions] = useState<JobDescription[]>([])

  const addSession = useCallback((session: Session) => {
    setSessions(prev => [session, ...prev])
  }, [])

  const addJobDescription = useCallback((jd: JobDescription) => {
    setJobDescriptions(prev => [jd, ...prev])
  }, [])

  const removeJobDescription = useCallback((id: string) => {
    setJobDescriptions(prev => prev.filter(j => j.id !== id))
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    setCurrentSession(null)
  }, [])

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      sessions,
      addSession,
      currentSession,
      setCurrentSession,
      jobDescriptions,
      addJobDescription,
      removeJobDescription,
      isAuthenticated: !!user,
      logout,
    }}>
      {children}
    </AppContext.Provider>
  )
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}

export { MOCK_USER }