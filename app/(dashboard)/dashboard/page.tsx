'use client'

import Link from 'next/link'
import { format } from 'date-fns'
import {
  Play,
  FileText,
  TrendingUp,
  Users,
  Flame,
  Clock,
  Target,
  ArrowRight,
  Crown,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { useUser } from '@/lib/stores'
import { mockUser, mockSessions, mockAnalytics, mockSubscription } from '@/lib/mock-data'

const quickActions = [
  {
    title: 'Start Mock Interview',
    description: 'Practice with AI interviewer',
    icon: Play,
    href: '/dashboard/practice',
    primary: true,
  },
  {
    title: 'Upload Job Description',
    description: 'Get tailored questions',
    icon: FileText,
    href: '/dashboard/job-descriptions',
  },
  {
    title: 'View Progress Report',
    description: 'Track your improvement',
    icon: TrendingUp,
    href: '/dashboard/progress',
  },
  {
    title: 'Find Peer Match',
    description: 'Practice with others',
    icon: Users,
    href: '/dashboard/practice?mode=peer',
  },
]

export default function DashboardPage() {
  const { user } = useUser()
  const currentUser = user || mockUser
  const subscription = mockSubscription

  const getTimeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'morning'
    if (hour < 18) return 'afternoon'
    return 'evening'
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Welcome Banner */}
        <Card className="overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-r from-primary/20 via-primary/10 to-transparent" />
            <CardContent className="relative py-6">
              <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-center">
                <div>
                  <h2 className="text-2xl font-bold">
                    Good {getTimeOfDay()}, {currentUser.name.split(' ')[0]}!
                  </h2>
                  <p className="mt-1 text-muted-foreground">
                    Ready for your next practice session?
                  </p>
                </div>
                <Button size="lg" asChild>
                  <Link href="/dashboard/practice">
                    <Play className="mr-2 h-5 w-5" />
                    Start Interview
                  </Link>
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>

        {/* Stats Row */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <p className="text-2xl font-bold">{currentUser.streak} days</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Target className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Avg. Score</p>
                <p className="text-2xl font-bold">{mockAnalytics.averageScore}%</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <Play className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Total Sessions</p>
                <p className="text-2xl font-bold">{currentUser.totalSessions}</p>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10">
                <Clock className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Hours Practiced</p>
                <p className="text-2xl font-bold">{currentUser.totalHoursPracticed}h</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Quick Actions */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
                <CardDescription>Start practicing or manage your prep</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 sm:grid-cols-2">
                  {quickActions.map((action) => (
                    <Link
                      key={action.title}
                      href={action.href}
                      className={`group flex items-start gap-4 rounded-lg border p-4 transition-colors hover:bg-muted/50 ${
                        action.primary ? 'border-primary/50 bg-primary/5' : ''
                      }`}
                    >
                      <div
                        className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-lg ${
                          action.primary ? 'bg-primary text-primary-foreground' : 'bg-muted'
                        }`}
                      >
                        <action.icon className="h-5 w-5" />
                      </div>
                      <div className="flex-1">
                        <p className="font-medium">{action.title}</p>
                        <p className="text-sm text-muted-foreground">{action.description}</p>
                      </div>
                      <ArrowRight className="mt-2 h-4 w-4 opacity-0 transition-opacity group-hover:opacity-100" />
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Recent Sessions */}
            <Card className="mt-6">
              <CardHeader className="flex flex-row items-center justify-between">
                <div>
                  <CardTitle>Recent Sessions</CardTitle>
                  <CardDescription>Your latest interview practice</CardDescription>
                </div>
                <Button variant="outline" size="sm" asChild>
                  <Link href="/dashboard/analytics">View All</Link>
                </Button>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {mockSessions.slice(0, 4).map((session) => (
                    <div
                      key={session.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-4">
                        <div
                          className={`flex h-10 w-10 items-center justify-center rounded-full text-sm font-bold ${
                            session.overallScore >= 80
                              ? 'bg-success/10 text-success'
                              : session.overallScore >= 60
                              ? 'bg-warning/10 text-warning'
                              : 'bg-destructive/10 text-destructive'
                          }`}
                        >
                          {session.overallScore}
                        </div>
                        <div>
                          <p className="font-medium">{session.role}</p>
                          <p className="text-sm text-muted-foreground">
                            {format(session.date, 'MMM d, yyyy')} &middot; {session.duration} min
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <Badge variant="secondary" className="capitalize">
                          {session.type}
                        </Badge>
                        <Badge variant="outline" className="capitalize">
                          {session.mode}
                        </Badge>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Subscription Status */}
            {subscription.plan === 'free' && (
              <Card className="overflow-hidden">
                <div className="bg-gradient-to-br from-primary/20 via-primary/10 to-transparent p-6">
                  <div className="flex items-center gap-2">
                    <Crown className="h-5 w-5 text-primary" />
                    <span className="font-semibold">Upgrade to Pro</span>
                  </div>
                  <p className="mt-2 text-sm text-muted-foreground">
                    Unlock unlimited interviews, video practice, and detailed analytics.
                  </p>
                  <div className="mt-4">
                    <div className="mb-2 flex items-center justify-between text-sm">
                      <span>Free sessions remaining</span>
                      <span className="font-medium">{subscription.sessionsRemaining}/3</span>
                    </div>
                    <Progress value={(subscription.sessionsRemaining || 0) / 3 * 100} className="h-2" />
                  </div>
                  <Button className="mt-4 w-full" asChild>
                    <Link href="/dashboard/pricing">
                      <Sparkles className="mr-2 h-4 w-4" />
                      Upgrade Now
                    </Link>
                  </Button>
                </div>
              </Card>
            )}

            {/* Streak Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Flame className="h-5 w-5 text-primary" />
                  Practice Streak
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center">
                  <p className="text-4xl font-bold text-primary">{currentUser.streak}</p>
                  <p className="text-sm text-muted-foreground">days in a row</p>
                </div>
                <div className="mt-4 flex justify-center gap-1">
                  {Array.from({ length: 7 }).map((_, i) => (
                    <div
                      key={i}
                      className={`h-8 w-8 rounded ${
                        i < currentUser.streak % 7 ? 'bg-primary' : 'bg-muted'
                      }`}
                    />
                  ))}
                </div>
                <p className="mt-4 text-center text-sm text-muted-foreground">
                  Keep it up! Practice daily to improve faster.
                </p>
              </CardContent>
            </Card>

            {/* Best Score */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5 text-success" />
                  Best Score
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <p className="text-4xl font-bold text-success">{mockAnalytics.bestScore}%</p>
                <p className="text-sm text-muted-foreground">Your highest interview score</p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
