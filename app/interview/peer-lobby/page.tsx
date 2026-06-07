'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  Zap,
  ArrowLeft,
  Users,
  Search,
  Star,
  MessageSquare,
  Clock,
  X,
  Loader2,
  RefreshCw,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Badge } from '@/components/ui/Badge'
import { Progress } from '@/components/ui/progress'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import { mockPeerMatch, mockUser } from '@/lib/mock-data'
import { toast } from 'sonner'

type MatchStatus = 'searching' | 'found' | 'timeout' | 'ready'

export default function PeerLobbyPage() {
  const router = useRouter()
  const [status, setStatus] = useState<MatchStatus>('searching')
  const [searchProgress, setSearchProgress] = useState(0)
  const [showTimeoutDialog, setShowTimeoutDialog] = useState(false)
  const [assignedRole, setAssignedRole] = useState<'interviewer' | 'interviewee'>('interviewee')

  // Simulate matching process
  useEffect(() => {
    if (status !== 'searching') return

    const progressInterval = setInterval(() => {
      setSearchProgress(prev => {
        if (prev >= 100) {
          clearInterval(progressInterval)
          // Simulate random match or timeout
          const matched = Math.random() > 0.3
          if (matched) {
            setStatus('found')
            setAssignedRole(Math.random() > 0.5 ? 'interviewer' : 'interviewee')
            toast.success('Match found!')
          } else {
            setStatus('timeout')
            setShowTimeoutDialog(true)
          }
          return 100
        }
        return prev + 2
      })
    }, 100)

    return () => clearInterval(progressInterval)
  }, [status])

  const handleRetry = () => {
    setStatus('searching')
    setSearchProgress(0)
    setShowTimeoutDialog(false)
  }

  const handlePracticeWithAI = () => {
    router.push('/interview/setup?mode=text')
  }

  const handleStartSession = () => {
    toast.success('Starting peer practice session...')
    // In a real app, this would start the peer-to-peer video call
    router.push('/interview/video')
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/dashboard/practice">
                <ArrowLeft className="h-5 w-5" />
              </Link>
            </Button>
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">InterviewAI</span>
            </div>
          </div>
          <Badge variant="secondary">
            <Users className="mr-1 h-3 w-3" />
            Peer Practice
          </Badge>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-2xl px-4 py-12">
        {/* Searching State */}
        {status === 'searching' && (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-32 w-32 items-center justify-center rounded-full bg-primary/10">
              <div className="relative">
                <Search className="h-12 w-12 text-primary animate-pulse" />
                <Loader2 className="absolute -bottom-1 -right-1 h-6 w-6 text-primary animate-spin" />
              </div>
            </div>
            <h1 className="text-2xl font-bold">Finding a Match...</h1>
            <p className="mt-2 text-muted-foreground">
              Looking for a practice partner with similar experience
            </p>
            <div className="mx-auto mt-8 max-w-md">
              <Progress value={searchProgress} className="h-2" />
              <p className="mt-2 text-sm text-muted-foreground">{searchProgress}% complete</p>
            </div>

            {/* Match Criteria */}
            <Card className="mx-auto mt-8 max-w-md text-left">
              <CardHeader>
                <CardTitle className="text-base">Match Criteria</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Target Role</span>
                  <span className="font-medium">{mockUser.targetRole}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Experience Level</span>
                  <span className="font-medium capitalize">{mockUser.experienceLevel}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">Industry</span>
                  <span className="font-medium">{mockUser.industry}</span>
                </div>
              </CardContent>
            </Card>

            <Button variant="outline" className="mt-8" onClick={() => router.push('/dashboard/practice')}>
              <X className="mr-2 h-4 w-4" />
              Cancel Search
            </Button>
          </div>
        )}

        {/* Match Found State */}
        {(status === 'found' || status === 'ready') && (
          <div className="text-center">
            <div className="mx-auto mb-8 flex h-24 w-24 items-center justify-center rounded-full bg-success/10">
              <Users className="h-10 w-10 text-success" />
            </div>
            <h1 className="text-2xl font-bold">Match Found!</h1>
            <p className="mt-2 text-muted-foreground">
              You&apos;ve been matched with a practice partner
            </p>

            {/* Peer Info Card */}
            <Card className="mx-auto mt-8 max-w-md">
              <CardContent className="py-6">
                <div className="flex items-center gap-4">
                  <Avatar className="h-16 w-16">
                    <AvatarFallback className="bg-primary/10 text-primary text-xl">
                      {mockPeerMatch.peerName.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div className="text-left">
                    <h3 className="text-lg font-semibold">{mockPeerMatch.peerName}</h3>
                    <p className="text-sm text-muted-foreground">{mockPeerMatch.peerRole}</p>
                    <div className="mt-1 flex items-center gap-2">
                      <div className="flex items-center gap-1">
                        <Star className="h-4 w-4 fill-warning text-warning" />
                        <span className="text-sm font-medium">{mockPeerMatch.peerRating}</span>
                      </div>
                      <Badge variant="secondary" className="capitalize">
                        {mockPeerMatch.peerExperience}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div className="mt-6 rounded-lg bg-primary/5 p-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Your Role</span>
                    <Badge variant={assignedRole === 'interviewer' ? 'default' : 'secondary'}>
                      {assignedRole === 'interviewer' ? (
                        <>
                          <MessageSquare className="mr-1 h-3 w-3" />
                          Interviewer
                        </>
                      ) : (
                        <>
                          <Users className="mr-1 h-3 w-3" />
                          Interviewee
                        </>
                      )}
                    </Badge>
                  </div>
                  <p className="mt-2 text-xs text-muted-foreground">
                    {assignedRole === 'interviewer'
                      ? 'You will ask questions and provide feedback first'
                      : 'You will answer questions first, then switch roles'}
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>Session duration: 45-60 minutes</span>
                </div>
              </CardContent>
            </Card>

            <div className="mt-8 flex flex-col items-center gap-3">
              <Button size="lg" onClick={handleStartSession}>
                Start Practice Session
              </Button>
              <Button variant="outline" onClick={() => router.push('/dashboard/practice')}>
                Cancel
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Timeout Dialog */}
      <AlertDialog open={showTimeoutDialog} onOpenChange={setShowTimeoutDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>No Match Found</AlertDialogTitle>
            <AlertDialogDescription>
              We couldn&apos;t find a practice partner at this time. Would you like to try again or practice with AI instead?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex-col gap-2 sm:flex-row">
            <Button variant="outline" onClick={handlePracticeWithAI} className="w-full sm:w-auto">
              Practice with AI
            </Button>
            <Button onClick={handleRetry} className="w-full sm:w-auto">
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
