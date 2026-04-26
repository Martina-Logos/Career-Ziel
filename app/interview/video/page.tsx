'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import {
  Zap,
  Clock,
  ArrowRight,
  SkipForward,
  Pause,
  Play,
  X,
  Mic,
  MicOff,
  Video,
  VideoOff,
  Volume2,
  AlertTriangle,
  Eye,
  User,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
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

export default function VideoInterviewPage() {
  const router = useRouter()
  const { currentQuestionIndex, questions, nextQuestion, submitAnswer, endSession } = useInterview()
  const videoRef = useRef<HTMLVideoElement>(null)

  const [stream, setStream] = useState<MediaStream | null>(null)
  const [isRecording, setIsRecording] = useState(true)
  const [isMuted, setIsMuted] = useState(false)
  const [isVideoOff, setIsVideoOff] = useState(false)
  const [timeRemaining, setTimeRemaining] = useState(180)
  const [isPaused, setIsPaused] = useState(false)
  const [showExitDialog, setShowExitDialog] = useState(false)
  const [transcript, setTranscript] = useState('')
  const [isAISpeaking, setIsAISpeaking] = useState(true)

  // Mock feedback data
  const [feedback, setFeedback] = useState({
    fillerWords: 0,
    eyeContact: 85,
    posture: 90,
  })

  const activeQuestions = questions.length > 0 ? questions : mockQuestions.slice(0, 5)
  const currentQuestion = activeQuestions[currentQuestionIndex] || activeQuestions[0]
  const progress = ((currentQuestionIndex + 1) / activeQuestions.length) * 100
  const isLastQuestion = currentQuestionIndex >= activeQuestions.length - 1

  // Initialize camera
  useEffect(() => {
    const initCamera = async () => {
      try {
        const mediaStream = await navigator.mediaDevices.getUserMedia({
          video: true,
          audio: true,
        })
        setStream(mediaStream)
        if (videoRef.current) {
          videoRef.current.srcObject = mediaStream
        }
      } catch {
        toast.error('Failed to access camera. Using placeholder.')
      }
    }
    initCamera()

    return () => {
      stream?.getTracks().forEach(track => track.stop())
    }
  }, [])

  // Simulate AI reading question
  useEffect(() => {
    setIsAISpeaking(true)
    const timer = setTimeout(() => setIsAISpeaking(false), 3000)
    return () => clearTimeout(timer)
  }, [currentQuestionIndex])

  // Simulate transcript and filler word detection
  useEffect(() => {
    if (isPaused || isAISpeaking) return

    const transcriptInterval = setInterval(() => {
      setTranscript(prev => {
        const words = ['I', 'think', 'that', 'um', 'the', 'key', 'is', 'to', 'like', 'focus', 'on']
        const newWord = words[Math.floor(Math.random() * words.length)]
        if (newWord === 'um' || newWord === 'like') {
          setFeedback(f => ({ ...f, fillerWords: f.fillerWords + 1 }))
        }
        return prev + ' ' + newWord
      })
    }, 800)

    return () => clearInterval(transcriptInterval)
  }, [isPaused, isAISpeaking])

  // Timer
  useEffect(() => {
    if (isPaused || isAISpeaking) return

    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          handleNext()
          return currentQuestion?.timeLimit || 180
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [isPaused, isAISpeaking, currentQuestion])

  // Reset on question change
  useEffect(() => {
    setTimeRemaining(currentQuestion?.timeLimit || 180)
    setTranscript('')
    setFeedback({ fillerWords: 0, eyeContact: 85, posture: 90 })
  }, [currentQuestionIndex, currentQuestion])

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const handleNext = useCallback(() => {
    submitAnswer(transcript)
    if (isLastQuestion) {
      toast.success('Interview complete!')
      router.push('/interview/feedback')
    } else {
      nextQuestion()
    }
  }, [isLastQuestion, nextQuestion, router, submitAnswer, transcript])

  const handleSkip = () => {
    if (isLastQuestion) {
      router.push('/interview/feedback')
    } else {
      nextQuestion()
      toast.info('Question skipped')
    }
  }

  const handleExit = () => {
    stream?.getTracks().forEach(track => track.stop())
    endSession()
    router.push('/dashboard')
  }

  const toggleMute = () => {
    if (stream) {
      stream.getAudioTracks().forEach(track => {
        track.enabled = isMuted
      })
      setIsMuted(!isMuted)
    }
  }

  const toggleVideo = () => {
    if (stream) {
      stream.getVideoTracks().forEach(track => {
        track.enabled = isVideoOff
      })
      setIsVideoOff(!isVideoOff)
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
                <Zap className="h-5 w-5 text-primary-foreground" />
              </div>
              <span className="text-xl font-bold">InterviewAI</span>
            </div>
            {isRecording && (
              <div className="flex items-center gap-2">
                <span className="flex h-3 w-3 rounded-full bg-destructive animate-pulse" />
                <span className="text-sm font-medium text-destructive">Recording</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 rounded-full px-4 py-2 ${
              timeRemaining < 30 ? 'bg-destructive/10 text-destructive' : 'bg-muted'
            }`}>
              <Clock className="h-4 w-4" />
              <span className="font-mono font-medium">{formatTime(timeRemaining)}</span>
            </div>
            <Button variant="outline" size="icon" onClick={() => setIsPaused(!isPaused)}>
              {isPaused ? <Play className="h-4 w-4" /> : <Pause className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" onClick={() => setShowExitDialog(true)}>
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>

        {/* Progress */}
        <div className="mx-auto max-w-6xl px-4 pb-4">
          <div className="flex items-center justify-between text-sm text-muted-foreground mb-2">
            <span>Question {currentQuestionIndex + 1} of {activeQuestions.length}</span>
            <span>{Math.round(progress)}% complete</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 py-6">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid gap-6 lg:grid-cols-3">
            {/* Video Area */}
            <div className="lg:col-span-2 space-y-4">
              {/* Question Display */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Badge variant="secondary">{currentQuestion.category}</Badge>
                    {isAISpeaking && (
                      <Badge className="bg-primary/10 text-primary">
                        <Volume2 className="mr-1 h-3 w-3 animate-pulse" />
                        AI Reading...
                      </Badge>
                    )}
                  </div>
                  <p className="text-lg font-medium leading-relaxed">
                    {currentQuestion.text}
                  </p>
                </CardContent>
              </Card>

              {/* Video Feed */}
              <div className="relative aspect-video overflow-hidden rounded-xl border bg-muted">
                {stream ? (
                  <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    muted
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="flex h-full items-center justify-center bg-gradient-to-br from-muted to-muted-foreground/10">
                    <div className="text-center">
                      <User className="mx-auto h-16 w-16 text-muted-foreground" />
                      <p className="mt-2 text-muted-foreground">Camera Preview</p>
                    </div>
                  </div>
                )}

                {isVideoOff && (
                  <div className="absolute inset-0 flex items-center justify-center bg-muted">
                    <VideoOff className="h-12 w-12 text-muted-foreground" />
                  </div>
                )}

                {/* Video Controls */}
                <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 items-center gap-2 rounded-full bg-background/90 px-4 py-2 backdrop-blur">
                  <Button
                    variant={isMuted ? 'destructive' : 'ghost'}
                    size="icon"
                    onClick={toggleMute}
                  >
                    {isMuted ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
                  </Button>
                  <Button
                    variant={isVideoOff ? 'destructive' : 'ghost'}
                    size="icon"
                    onClick={toggleVideo}
                  >
                    {isVideoOff ? <VideoOff className="h-4 w-4" /> : <Video className="h-4 w-4" />}
                  </Button>
                </div>
              </div>

              {/* Transcript */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium">Live Transcript</span>
                    <Badge variant="secondary">Beta</Badge>
                  </div>
                  <div className="min-h-20 rounded-lg bg-muted p-3 text-sm">
                    {transcript || (
                      <span className="text-muted-foreground">
                        {isAISpeaking ? 'Waiting for AI to finish reading...' : 'Start speaking to see your transcript...'}
                      </span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar - Feedback */}
            <div className="space-y-4">
              {/* Filler Word Counter */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm font-medium">Filler Words</span>
                    {feedback.fillerWords > 5 && <AlertTriangle className="h-4 w-4 text-warning" />}
                  </div>
                  <p className={`mt-2 text-3xl font-bold ${
                    feedback.fillerWords > 5 ? 'text-warning' : 'text-success'
                  }`}>
                    {feedback.fillerWords}
                  </p>
                  <p className="text-xs text-muted-foreground">um, uh, like detected</p>
                </CardContent>
              </Card>

              {/* Eye Contact */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Eye className="h-4 w-4" />
                    <span className="text-sm font-medium">Eye Contact</span>
                  </div>
                  <Progress value={feedback.eyeContact} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">{feedback.eyeContact}% on camera</p>
                </CardContent>
              </Card>

              {/* Posture */}
              <Card>
                <CardContent className="py-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4" />
                    <span className="text-sm font-medium">Posture</span>
                  </div>
                  <Progress value={feedback.posture} className="h-2" />
                  <p className="mt-2 text-sm text-muted-foreground">
                    {feedback.posture >= 80 ? 'Good posture!' : 'Try sitting up straighter'}
                  </p>
                </CardContent>
              </Card>

              {/* Action Buttons */}
              <div className="space-y-2">
                <Button className="w-full" onClick={handleNext}>
                  {isLastQuestion ? (
                    <>
                      Finish Interview
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  ) : (
                    <>
                      Next Question
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
                <Button variant="outline" className="w-full" onClick={handleSkip}>
                  <SkipForward className="mr-2 h-4 w-4" />
                  Skip Question
                </Button>
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* Exit Dialog */}
      <AlertDialog open={showExitDialog} onOpenChange={setShowExitDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>End Interview?</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to end this interview? Your recording will be saved up to this point.
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
