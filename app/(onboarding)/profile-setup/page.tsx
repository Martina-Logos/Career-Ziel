'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Zap, ArrowRight, ArrowLeft, Upload, FileText, Loader2, Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useUser } from '@/lib/stores'
import { industries, experienceLevels } from '@/lib/mock-data'
import { toast } from 'sonner'

const steps = [
  { id: 1, title: 'Basic Info', description: 'Tell us about yourself' },
  { id: 2, title: 'Experience', description: 'Your career details' },
  { id: 3, title: 'Documents', description: 'Optional uploads' },
]

export default function ProfileSetupPage() {
  const router = useRouter()
  const { updateUser } = useUser()
  const [currentStep, setCurrentStep] = useState(1)
  const [isLoading, setIsLoading] = useState(false)
  const [formData, setFormData] = useState({
    currentRole: '',
    targetRole: '',
    industry: '',
    experienceLevel: '',
    resume: null as File | null,
    jobDescription: '',
  })

  const progress = (currentStep / steps.length) * 100

  const handleNext = () => {
    if (currentStep === 1) {
      if (!formData.currentRole || !formData.targetRole) {
        toast.error('Please fill in your current and target roles')
        return
      }
    }
    if (currentStep === 2) {
      if (!formData.industry || !formData.experienceLevel) {
        toast.error('Please select your industry and experience level')
        return
      }
    }
    if (currentStep < steps.length) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleFinish = async () => {
    setIsLoading(true)
    try {
      await new Promise(resolve => setTimeout(resolve, 1000))
      updateUser({
        currentRole: formData.currentRole,
        targetRole: formData.targetRole,
        industry: formData.industry,
        experienceLevel: formData.experienceLevel as 'entry' | 'mid' | 'senior',
      })
      toast.success('Profile setup complete!')
      router.push('/dashboard')
    } catch {
      toast.error('Something went wrong')
    } finally {
      setIsLoading(false)
    }
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      if (file.type !== 'application/pdf') {
        toast.error('Please upload a PDF file')
        return
      }
      setFormData(prev => ({ ...prev, resume: file }))
      toast.success('Resume uploaded successfully')
    }
  }

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between border-b px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">InterviewAI</span>
        </div>
        <Button variant="ghost" onClick={() => router.push('/dashboard')}>
          Skip for now
        </Button>
      </div>

      {/* Progress */}
      <div className="border-b px-6 py-4">
        <div className="mx-auto max-w-2xl">
          <div className="mb-2 flex items-center justify-between text-sm">
            <span className="font-medium">Profile Setup</span>
            <span className="text-muted-foreground">Step {currentStep} of {steps.length}</span>
          </div>
          <Progress value={progress} className="h-2" />
          <div className="mt-4 flex justify-between">
            {steps.map((step) => (
              <div
                key={step.id}
                className={`flex items-center gap-2 ${
                  step.id === currentStep
                    ? 'text-primary'
                    : step.id < currentStep
                    ? 'text-success'
                    : 'text-muted-foreground'
                }`}
              >
                <div
                  className={`flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
                    step.id === currentStep
                      ? 'bg-primary text-primary-foreground'
                      : step.id < currentStep
                      ? 'bg-success text-success-foreground'
                      : 'bg-muted'
                  }`}
                >
                  {step.id < currentStep ? <Check className="h-3 w-3" /> : step.id}
                </div>
                <span className="hidden text-sm sm:block">{step.title}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="flex flex-1 items-center justify-center px-4 py-8">
        <Card className="w-full max-w-lg">
          <CardHeader>
            <CardTitle>{steps[currentStep - 1].title}</CardTitle>
            <CardDescription>{steps[currentStep - 1].description}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {currentStep === 1 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="currentRole">Current Role</Label>
                  <Input
                    id="currentRole"
                    placeholder="e.g., Software Engineer"
                    value={formData.currentRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, currentRole: e.target.value }))}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="targetRole">Target Role</Label>
                  <Input
                    id="targetRole"
                    placeholder="e.g., Senior Software Engineer"
                    value={formData.targetRole}
                    onChange={(e) => setFormData(prev => ({ ...prev, targetRole: e.target.value }))}
                  />
                  <p className="text-xs text-muted-foreground">
                    The role you&apos;re preparing to interview for
                  </p>
                </div>
              </>
            )}

            {currentStep === 2 && (
              <>
                <div className="space-y-2">
                  <Label htmlFor="industry">Industry</Label>
                  <Select
                    value={formData.industry}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, industry: value }))}
                  >
                    <SelectTrigger id="industry">
                      <SelectValue placeholder="Select your industry" />
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
                <div className="space-y-2">
                  <Label htmlFor="experience">Experience Level</Label>
                  <Select
                    value={formData.experienceLevel}
                    onValueChange={(value) => setFormData(prev => ({ ...prev, experienceLevel: value }))}
                  >
                    <SelectTrigger id="experience">
                      <SelectValue placeholder="Select your experience level" />
                    </SelectTrigger>
                    <SelectContent>
                      {experienceLevels.map((level) => (
                        <SelectItem key={level.value} value={level.value}>
                          {level.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {currentStep === 3 && (
              <>
                <div className="space-y-2">
                  <Label>Resume (Optional)</Label>
                  <div className="flex items-center justify-center">
                    <label
                      htmlFor="resume"
                      className="flex w-full cursor-pointer flex-col items-center justify-center rounded-lg border-2 border-dashed p-6 transition-colors hover:bg-muted/50"
                    >
                      {formData.resume ? (
                        <div className="flex items-center gap-2 text-success">
                          <FileText className="h-8 w-8" />
                          <div className="text-center">
                            <p className="font-medium">{formData.resume.name}</p>
                            <p className="text-sm text-muted-foreground">Click to replace</p>
                          </div>
                        </div>
                      ) : (
                        <>
                          <Upload className="mb-2 h-8 w-8 text-muted-foreground" />
                          <p className="text-sm font-medium">Upload your resume</p>
                          <p className="text-xs text-muted-foreground">PDF up to 10MB</p>
                        </>
                      )}
                      <input
                        id="resume"
                        type="file"
                        accept=".pdf"
                        className="hidden"
                        onChange={handleFileChange}
                      />
                    </label>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="jobDescription">Job Description (Optional)</Label>
                  <Textarea
                    id="jobDescription"
                    placeholder="Paste a job description to get personalized questions..."
                    value={formData.jobDescription}
                    onChange={(e) => setFormData(prev => ({ ...prev, jobDescription: e.target.value }))}
                    className="min-h-32"
                  />
                  <p className="text-xs text-muted-foreground">
                    We&apos;ll extract key skills and qualifications to tailor your practice
                  </p>
                </div>
              </>
            )}

            {/* Navigation */}
            <div className="flex justify-between pt-4">
              <Button
                variant="outline"
                onClick={handleBack}
                disabled={currentStep === 1}
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back
              </Button>
              {currentStep === steps.length ? (
                <Button onClick={handleFinish} disabled={isLoading}>
                  {isLoading ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <>
                      Complete Setup
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              ) : (
                <Button onClick={handleNext}>
                  Next
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
