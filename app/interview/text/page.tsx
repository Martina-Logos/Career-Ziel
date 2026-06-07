'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Clock,
  ArrowRight,
  SkipForward,
  Lightbulb,
  Pause,
  Play,
  X,
  Send,
  Crown,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent } from '@/components/ui/Card'
import { Textarea } from '@/components/ui/textarea'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/Badge'
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
import { useInterview } from '@/lib/stores'
import { mockQuestions } from '@/lib/mock-data'
import { toast } from 'sonner'

export default function TextInterviewPage() {
  const router = useRouter()
  const { currentSession, currentQuestionIndex, questions, nextQuestion, submitAnswer, endSession } = useInterview()
  
  const [answer, setAnswer] = useState('')
  const [timeRemaining, setTimeRemaining] = useState(180)
  const [isPaused, setIsPaused] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Use mock questions if no session
  const activeQuestions = questions.length > 0 ? questions : mockQuestions.slice(0, 5)
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0]
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex >= activeQuestions.length - 1

  // Timer
  useEffect(() => {
    if (isPaused) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleSubmit()
          return currentQuestion?.timeLimit || 180
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, currentQuestion])

  // Reset timer on question change
  useEffect(() => {
    setTimeRemaining(currentQuestion?.timeLimit || 180)
    setAnswer('')
  }, [currentQuestionIndex, currentQuestion])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleSubmit = useCallback(async () => {
    if (!answer.trim()) {
      toast.error('Please provide an answer before submitting')
      return
    }

    setIsSubmitting(true)
    submitAnswer(answer)

    // Simulate API delay
    await new Promise(resolve => setTimeout(resolve, 500))
    setIsSubmitting(false)

    if (isLastQuestion) {
      toast.success('Interview complete!')
      router.push('/interview/feedback')
    } else {
      nextQuestion()
      toast.success('Answer submitted!')
    }
  }, [answer, isLastQuestion, nextQuestion, router, submitAnswer])

  const handleSkip = () => {
    if (isLastQuestion) {
      router.push('/interview/feedback')
    } else {
      nextQuestion()
      toast.info('Question skipped')
    }
  }

  const handleExit = () => {
    endSession()
    router.push('/dashboard')
  }

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy':
        return 'bg-success/10 text-success'
      case 'medium':
        return 'bg-warning/10 text-warning'
      case 'hard':
        return 'bg-destructive/10 text-destructive'
      default:
        return 'bg-muted'
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-4xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">InterviewAI</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            {/* Timer */}
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              timeRemaining < 30 ? 'bg-destructive/10 text-destructive' : 'bg-muted'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
            </div>

            {/* Pause/Play */}
            <Button
              variant="outline"
              size="icon"
              onClick={() => setIsPaused(!isPaused)}
            >
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>

            {/* Exit */}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setShowExitDialog(true)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="mx-auto max-w-4xl px-4 pb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Paused Overlay */}
      {isPaused && (
        <div className="fixed inset-0 z-40 flex items-center justify-center bg-background/80 backdrop-blur-sm">
          <Card className="w-full max-w-md">
            <CardContent className="py-8 text-center">
              <Pause className="mx-auto h-12 w-12 text-primary" />
              <h2 className="mt-4 text-xl font-bold">Interview Paused</h2>
              <p className="mt-2 text-muted-foreground">
                Take a moment to collect your thoughts.
              </p>
              <Button className="mt-6" onClick={() => setIsPaused(false)}>
                <Play className="mr-2 h-4 w-4" />
                Resume Interview
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Main Content */}
      <main className="flex-1 py-8">
        <div className="mx-auto max-w-3xl px-4">
          {/* Question Card */}
          <Card className="mb-6">
            <CardContent className="py-6">
              <div className="mb-4 flex items-center gap-2">
                <Badge variant="secondary">{currentQuestion.category}</Badge>
                <Badge className={getDifficultyColor(currentQuestion.difficulty)}>
                  {currentQuestion.difficulty}
                </Badge>
              </div>
              <p className="text-xl font-medium leading-relaxed lg:text-2xl">
                {currentQuestion.text}
              </p>
            </CardContent>
          </Card>

          {/* Answer Input */}
          <Card>
            <CardContent className="py-6">
              <div className="space-y-4">
                <Textarea
                  placeholder="Type your answer here..."
                  value={answer}
                  onChange={(e) => setAnswer(e.target.value)}
                  className="min-h-48 resize-none text-base"
                  disabled={isPaused}
                />
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {answer.length} characters
                  </span>
                  <div className="flex items-center gap-2">
                    <Button variant="ghost" size="sm" disabled>
                      <Lightbulb className="mr-2 h-4 w-4" />
                      Hint
                      <Badge variant="secondary" className="ml-2">
                        <Crown className="mr-1 h-3 w-3" />
                        Pro
                      </Badge>
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="mt-6 flex items-center justify-between">
            <Button variant="outline" onClick={handleSkip}>
              <SkipForward className="mr-2 h-4 w-4" />
              Skip Question
            </Button>
            <Button onClick={handleSubmit} disabled={isSubmitting || isPaused}>
              {isSubmitting ? (
                'Submitting...'
              ) : isLastQuestion ? (
                <>
                  Finish Interview
                  <ArrowRight className="ml-2 h-4 w-4" />
                </>
              ) : (
                <>
                  <Send className="mr-2 h-4 w-4" />
                  Submit Answer
                </>
              )}
            </Button>
          </div>
        </div>
      </main>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this interview? Your progress will not be saved.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Continue Interview</AlertDialogCancel>
            <AlertDialogAction onClick={handleExit} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              End Interview
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  )
}
