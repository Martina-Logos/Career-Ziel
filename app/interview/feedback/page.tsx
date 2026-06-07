'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  Zap,
  ArrowRight,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  FileText,
  Share2,
  Trophy,
  TrendingUp,
  MessageSquare,
  Target,
  Sparkles,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/Badge'
import { Separator } from '@/components/ui/separator'
import { mockSessions } from '@/lib/mock-data'

const mockFeedback = {
  overallScore: 78,
  dimensions: {
    clarity: 82,
    confidence: 75,
    relevance: 80,
    technicalAccuracy: 76,
  },
  highlights: [
    'Strong use of the STAR method in behavioral questions',
    'Good specific examples from past experience',
    'Clear and organized thought process',
    'Professional tone throughout',
  ],
  improvements: [
    'Could provide more quantifiable results',
    'Elaborate more on team collaboration aspects',
    'Include more technical depth in system design answers',
    'Work on reducing filler words (um, like)',
  ],
  aiSummary: `Overall, this was a solid interview performance showing good communication skills and relevant experience. Your answers demonstrated a clear understanding of the role requirements, though there's room to strengthen your responses with more specific metrics and technical details. Focus on quantifying your achievements and providing more depth in technical discussions to elevate your performance to the next level.`,
}

export default function FeedbackPage() {
  const router = useRouter()
  const [isAnimating, setIsAnimating] = useState(true)
  const [displayScore, setDisplayScore] = useState(0)

  // Animate score on mount
  useEffect(() => {
    const duration = 1500
    const steps = 60
    const increment = mockFeedback.overallScore / steps
    let current = 0

    const timer = setInterval(() => {
      current += increment
      if (current >= mockFeedback.overallScore) {
        setDisplayScore(mockFeedback.overallScore)
        setIsAnimating(false)
        clearInterval(timer)
      } else {
        setDisplayScore(Math.round(current))
      }
    }, duration / steps)

    return () => clearInterval(timer)
  }, [])

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-destructive'
  }

  const getScoreBg = (score: number) => {
    if (score >= 80) return 'bg-success/10'
    if (score >= 60) return 'bg-warning/10'
    return 'bg-destructive/10'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-2">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
              <Zap className="h-5 w-5 text-primary-foreground" />
            </div>
            <span className="text-xl font-bold">InterviewAI</span>
          </div>
          <Badge variant="secondary">
            <Trophy className="mr-1 h-3 w-3" />
            Session Complete
          </Badge>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Score Hero */}
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold">Interview Complete!</h1>
          <p className="mt-1 text-muted-foreground">Here&apos;s how you performed</p>

          <div className="mt-8">
            <div className={`mx-auto flex h-36 w-36 items-center justify-center rounded-full ${getScoreBg(mockFeedback.overallScore)}`}>
              <div className="text-center">
                <span className={`text-5xl font-bold ${getScoreColor(mockFeedback.overallScore)}`}>
                  {displayScore}
                </span>
                <span className="text-2xl text-muted-foreground">/100</span>
              </div>
            </div>
            <p className="mt-4 text-lg font-medium">
              {mockFeedback.overallScore >= 80
                ? 'Excellent Performance!'
                : mockFeedback.overallScore >= 60
                ? 'Good Job!'
                : 'Keep Practicing!'}
            </p>
          </div>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Dimension Breakdown */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Score Breakdown
              </CardTitle>
              <CardDescription>Performance across different dimensions</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {Object.entries(mockFeedback.dimensions).map(([key, value]) => (
                <div key={key}>
                  <div className="mb-2 flex items-center justify-between">
                    <span className="text-sm font-medium capitalize">
                      {key.replace(/([A-Z])/g, ' $1').trim()}
                    </span>
                    <span className={`text-sm font-bold ${getScoreColor(value)}`}>{value}%</span>
                  </div>
                  <Progress value={value} className="h-2" />
                </div>
              ))}
            </CardContent>
          </Card>

          {/* Quick Stats */}
          <div className="space-y-4">
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                    <MessageSquare className="h-5 w-5 text-primary" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Questions</p>
                    <p className="text-lg font-bold">5 Answered</p>
                  </div>
                </div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="py-4">
                <div className="flex items-center gap-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-success/10">
                    <TrendingUp className="h-5 w-5 text-success" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">vs. Last Session</p>
                    <p className="text-lg font-bold text-success">+6 points</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Highlights & Improvements */}
        <div className="mt-6 grid gap-6 lg:grid-cols-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-success">
                <CheckCircle2 className="h-5 w-5" />
                What You Did Well
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mockFeedback.highlights.map((highlight, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-success" />
                    <span className="text-sm">{highlight}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-warning">
                <AlertTriangle className="h-5 w-5" />
                Areas to Improve
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-3">
                {mockFeedback.improvements.map((improvement, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0 text-warning" />
                    <span className="text-sm">{improvement}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* AI Summary */}
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-primary" />
              AI Summary
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground leading-relaxed">{mockFeedback.aiSummary}</p>
          </CardContent>
        </Card>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href={`/interview/report/${mockSessions[0].id}`}>
              <FileText className="mr-2 h-5 w-5" />
              View Full Report
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/interview/setup">
              <RotateCcw className="mr-2 h-5 w-5" />
              Practice Again
            </Link>
          </Button>
          <Button size="lg" variant="ghost" asChild>
            <Link href="/dashboard">
              <ArrowRight className="mr-2 h-5 w-5" />
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
