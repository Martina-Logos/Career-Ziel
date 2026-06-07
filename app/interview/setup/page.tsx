'use client'

import { useState, Suspense } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import {
  Zap,
  ArrowLeft,
  ArrowRight,
  Clock,
  Gauge,
  Mic,
  Video,
  FileText,
  Check,
  AlertCircle,
  Loader2,
} from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/Card'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Badge } from '@/components/ui/Badge'
import { useInterview } from '@/lib/stores'
import { interviewTypes, industries } from '@/lib/mock-data'
import { toast } from 'sonner'

type InterviewConfig = {
  jobDescription: string
  role: string
  industry: string
  type: 'behavioral' | 'technical' | 'case-study' | 'mixed'
  duration: number
  difficulty: 'easy' | 'medium' | 'hard'
  cameraEnabled: boolean
  micEnabled: boolean
}

function SetupContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const mode = (searchParams.get('mode') as 'text' | 'video') || 'text'
  const { startSession } = useInterview()

  const [isLoading, setIsLoading] = useState(false)
  const [config, setConfig] = useState<InterviewConfig>({
    jobDescription: '',
    role: '',
    industry: '',
    type: 'behavioral' as const,
    duration: 30,
    difficulty: 'medium' as const,
    cameraEnabled: mode === 'video',
    micEnabled: mode === 'video',
  })

  const [permissions, setPermissions] = useState({
    camera: false,
    microphone: false,
  })

  const handlePermissionRequest = async (type: 'camera' | 'microphone') => {
    try {
      const constraints = type === 'camera' ? { video: true } : { audio: true }
      const stream = await navigator.mediaDevices.getUserMedia(constraints)
      stream.getTracks().forEach(track => track.stop())
      setPermissions(prev => ({ ...prev, [type]: true }))
      toast.success(`${type === 'camera' ? 'Camera' : 'Microphone'} access granted`)
    } catch {
      toast.error(`${type === 'camera' ? 'Camera' : 'Microphone'} access denied`)
    }
  }

  const handleStartInterview = async () => {
    if (!config.role) {
      toast.error('Please enter a target role')
      return
    }

    if (mode === 'video' && (!permissions.camera || !permissions.microphone)) {
      toast.error('Please grant camera and microphone permissions for video mode')
      return
    }

    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 500))
      startSession({
        role: config.role,
        type: config.type,
        mode: mode,
        difficulty: config.difficulty,
        duration: config.duration,
      })
      router.push(mode === 'video' ? '/interview/video' : '/interview/text')
    } catch {
      toast.error('Failed to start interview')
    } finally {
      setIsLoading(false)
    }
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
          <Badge variant="secondary" className="capitalize">
            {mode} Mode
          </Badge>
        </div>
      </header>

      {/* Content */}
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold">Pre-Interview Setup</h1>
          <p className="mt-1 text-muted-foreground">
            Configure your interview session
          </p>
        </div>

        <div className="grid gap-6 lg:grid-cols-2">
          {/* Left Column - Configuration */}
          <div className="space-y-6">
            {/* Job Description */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Job Description
                </CardTitle>
                <CardDescription>
                  Paste a job description to get tailored questions
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <Textarea
                  placeholder="Paste the job description here for personalized questions..."
                  value={config.jobDescription}
                  onChange={(e) => setConfig(prev => ({ ...prev, jobDescription: e.target.value }))}
                  className="min-h-32"
                />
                {config.jobDescription && (
                  <div className="flex items-center gap-2 text-sm text-success">
                    <Check className="h-4 w-4" />
                    Job description detected - questions will be tailored
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Role & Industry */}
            <Card>
              <CardHeader>
                <CardTitle>Target Role</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="role">Role Title</Label>
                  <input
                    id="role"
                    type="text"
                    placeholder="e.g., Senior Software Engineer"
                    value={config.role}
                    onChange={(e) => setConfig(prev => ({ ...prev, role: e.target.value }))}
                    className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={config.industry}
                    onValueChange={(value) => setConfig(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select industry" />
                    </SelectTrigger>
                    <SelectContent>
                      {industries.map((industry) => (
                        <SelectItem key={industry} value={industry}>
                          {industry}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Right Column - Settings */}
          <div className="space-y-6">
            {/* Interview Type */}
            <Card>
              <CardHeader>
                <CardTitle>Interview Type</CardTitle>
              </CardHeader>
              <CardContent>
                <Select
                  value={config.type}
                  onValueChange={(value: 'behavioral' | 'technical' | 'case-study' | 'mixed') => 
                    setConfig(prev => ({ ...prev, type: value }))
                  }
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {interviewTypes.map((type) => (
                      <SelectItem key={type.value} value={type.value}>
                        <div>
                          <span className="font-medium">{type.label}</span>
                          <span className="ml-2 text-muted-foreground">- {type.description}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </CardContent>
            </Card>

            {/* Duration & Difficulty */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="h-5 w-5" />
                  Duration & Difficulty
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label>Duration</Label>
                    <span className="text-sm font-medium">{config.duration} minutes</span>
                  </div>
                  <Slider
                    value={[config.duration]}
                    onValueChange={([value]) => setConfig(prev => ({ ...prev, duration: value }))}
                    min={15}
                    max={60}
                    step={15}
                    className="w-full"
                  />
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>15 min</span>
                    <span>30 min</span>
                    <span>45 min</span>
                    <span>60 min</span>
                  </div>
                </div>

                <div className="space-y-4">
                  <Label>Difficulty</Label>
                  <div className="flex gap-2">
                    {(['easy', 'medium', 'hard'] as const).map((diff) => (
                      <Button
                        key={diff}
                        variant={config.difficulty === diff ? 'default' : 'outline'}
                        size="sm"
                        onClick={() => setConfig(prev => ({ ...prev, difficulty: diff }))}
                        className="flex-1 capitalize"
                      >
                        <Gauge className="mr-2 h-4 w-4" />
                        {diff}
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Permissions (Video Mode Only) */}
            {mode === 'video' && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Video className="h-5 w-5" />
                    Camera & Microphone
                  </CardTitle>
                  <CardDescription>
                    Required permissions for video interview
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Video className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Camera</p>
                        <p className="text-sm text-muted-foreground">For video recording</p>
                      </div>
                    </div>
                    {permissions.camera ? (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <Check className="mr-1 h-3 w-3" />
                        Granted
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => handlePermissionRequest('camera')}>
                        Enable
                      </Button>
                    )}
                  </div>
                  <div className="flex items-center justify-between rounded-lg border p-4">
                    <div className="flex items-center gap-3">
                      <Mic className="h-5 w-5" />
                      <div>
                        <p className="font-medium">Microphone</p>
                        <p className="text-sm text-muted-foreground">For speech analysis</p>
                      </div>
                    </div>
                    {permissions.microphone ? (
                      <Badge variant="secondary" className="bg-success/10 text-success">
                        <Check className="mr-1 h-3 w-3" />
                        Granted
                      </Badge>
                    ) : (
                      <Button size="sm" onClick={() => handlePermissionRequest('microphone')}>
                        Enable
                      </Button>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Start Button */}
        <div className="mt-8 flex justify-end">
          <Button size="lg" onClick={handleStartInterview} disabled={isLoading}>
            {isLoading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              <>
                Start Interview
                <ArrowRight className="ml-2 h-5 w-5" />
              </>
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

export default function InterviewSetupPage() {
  return (
    <Suspense fallback={
      <div className="flex min-h-screen items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    }>
      <SetupContent />
    </Suspense>
  )
}
