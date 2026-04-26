'use client'

import { use } from 'react'
import Link from 'next/link'
import { format } from 'date-fns'
import {
  Zap,
  ArrowLeft,
  Download,
  Share2,
  Play,
  ChevronDown,
  ChevronUp,
  Clock,
  Target,
  MessageSquare,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Separator } from '@/components/ui/separator'
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible'
import { mockSessions, mockQuestions } from '@/lib/mock-data'
import { useState } from 'react'

// Mock detailed feedback for each question
const questionFeedback = mockQuestions.slice(0, 5).map((q, index) => ({
  ...q,
  userAnswer: `This is a sample answer for the question. In my previous role, I demonstrated strong skills in this area by leading a project that resulted in significant improvements. I collaborated with cross-functional teams and used data-driven approaches to solve complex problems.`,
  score: 70 + Math.floor(Math.random() * 25),
  feedback: {
    clarity: 75 + Math.floor(Math.random() * 20),
    confidence: 70 + Math.floor(Math.random() * 25),
    relevance: 80 + Math.floor(Math.random() * 15),
    aiComment: `Good response that addresses the key points of the question. Consider adding more specific examples and quantifiable results to strengthen your answer.`,
  },
}))

export default function ReportPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  const session = mockSessions.find(s => s.id === id) || mockSessions[0]

  const toggleQuestion = (questionId: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(questionId)) {
      newExpanded.delete(questionId)
    } else {
      newExpanded.add(questionId)
    }
    setExpandedQuestions(newExpanded)
  }

  const getScoreColor = (score: number) => {
    if (score >= 80) return 'text-success'
    if (score >= 60) return 'text-warning'
    return 'text-destructive'
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="/interview/feedback">
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
          <div className="flex items-center gap-2">
            <Button variant="outline" size="sm" disabled>
              <Download className="mr-2 h-4 w-4" />
              PDF
              <Badge variant="secondary" className="ml-2">
                <Crown className="mr-1 h-3 w-3" />
                Pro
              </Badge>
            </Button>
            <Button variant="outline" size="sm">
              <Share2 className="mr-2 h-4 w-4" />
              Share
            </Button>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-5xl px-4 py-8">
        {/* Session Metadata */}
        <Card className="mb-6">
          <CardContent className="py-6">
            <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
              <div>
                <h1 className="text-2xl font-bold">{session.role}</h1>
                {session.company && (
                  <p className="text-muted-foreground">{session.company}</p>
                )}
                <div className="mt-2 flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="capitalize">{session.type}</Badge>
                  <Badge variant="outline" className="capitalize">{session.mode}</Badge>
                  <Badge variant="outline" className="capitalize">{session.difficulty}</Badge>
                </div>
              </div>
              <div className="flex items-center gap-6 text-sm">
                <div className="flex items-center gap-2">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <span>{session.duration} minutes</span>
                </div>
                <div className="flex items-center gap-2">
                  <MessageSquare className="h-4 w-4 text-muted-foreground" />
                  <span>{questionFeedback.length} questions</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Date: </span>
                  <span className="font-medium">{format(session.date, 'MMM d, yyyy')}</span>
                </div>
              </div>
            </div>

            <Separator className="my-6" />

            <div className="flex items-center justify-center gap-8">
              <div className="text-center">
                <div className={`text-4xl font-bold ${getScoreColor(session.overallScore)}`}>
                  {session.overallScore}
                </div>
                <p className="text-sm text-muted-foreground">Overall Score</p>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="text-4xl font-bold">{questionFeedback.length}</div>
                <p className="text-sm text-muted-foreground">Questions</p>
              </div>
              <Separator orientation="vertical" className="h-12" />
              <div className="text-center">
                <div className="text-4xl font-bold">{session.duration}m</div>
                <p className="text-sm text-muted-foreground">Duration</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Question by Question Breakdown */}
        <div className="space-y-4">
          <h2 className="text-xl font-bold">Question-by-Question Breakdown</h2>
          
          {questionFeedback.map((question, index) => (
            <Collapsible
              key={question.id}
              open={expandedQuestions.has(question.id)}
              onOpenChange={() => toggleQuestion(question.id)}
            >
              <Card>
                <CollapsibleTrigger className="w-full">
                  <CardHeader className="pb-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-4 text-left">
                        <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full font-bold ${
                          question.score >= 80
                            ? 'bg-success/10 text-success'
                            : question.score >= 60
                            ? 'bg-warning/10 text-warning'
                            : 'bg-destructive/10 text-destructive'
                        }`}>
                          {question.score}
                        </div>
                        <div>
                          <div className="mb-1 flex items-center gap-2">
                            <Badge variant="secondary">{question.category}</Badge>
                            <span className="text-sm text-muted-foreground">
                              Question {index + 1}
                            </span>
                          </div>
                          <p className="text-sm font-medium line-clamp-2">
                            {question.text}
                          </p>
                        </div>
                      </div>
                      {expandedQuestions.has(question.id) ? (
                        <ChevronUp className="h-5 w-5 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="h-5 w-5 text-muted-foreground" />
                      )}
                    </div>
                  </CardHeader>
                </CollapsibleTrigger>
                <CollapsibleContent>
                  <CardContent className="pt-0">
                    <Separator className="mb-4" />
                    
                    {/* Score Breakdown */}
                    <div className="mb-6 grid gap-4 sm:grid-cols-3">
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Clarity</span>
                          <span className="font-medium">{question.feedback.clarity}%</span>
                        </div>
                        <Progress value={question.feedback.clarity} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Confidence</span>
                          <span className="font-medium">{question.feedback.confidence}%</span>
                        </div>
                        <Progress value={question.feedback.confidence} className="h-2" />
                      </div>
                      <div>
                        <div className="mb-1 flex items-center justify-between text-sm">
                          <span>Relevance</span>
                          <span className="font-medium">{question.feedback.relevance}%</span>
                        </div>
                        <Progress value={question.feedback.relevance} className="h-2" />
                      </div>
                    </div>

                    {/* Your Answer */}
                    <div className="mb-4">
                      <h4 className="mb-2 text-sm font-medium">Your Answer</h4>
                      <div className="rounded-lg bg-muted p-4 text-sm">
                        {question.userAnswer}
                      </div>
                    </div>

                    {/* AI Feedback */}
                    <div>
                      <h4 className="mb-2 text-sm font-medium">AI Feedback</h4>
                      <div className="rounded-lg border border-primary/20 bg-primary/5 p-4 text-sm">
                        {question.feedback.aiComment}
                      </div>
                    </div>

                    {/* Video Playback Placeholder */}
                    {session.mode === 'video' && (
                      <div className="mt-4">
                        <Button variant="outline" size="sm" disabled>
                          <Play className="mr-2 h-4 w-4" />
                          Watch Recording
                          <Badge variant="secondary" className="ml-2">
                            <Crown className="mr-1 h-3 w-3" />
                            Pro
                          </Badge>
                        </Button>
                      </div>
                    )}
                  </CardContent>
                </CollapsibleContent>
              </Card>
            </Collapsible>
          ))}
        </div>

        {/* Actions */}
        <div className="mt-8 flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
          <Button size="lg" asChild>
            <Link href="/interview/setup">
              Practice Again
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link href="/dashboard">
              Back to Dashboard
            </Link>
          </Button>
        </div>
      </div>
    </div>
  )
}
