'use client'

import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import {
  MessageSquare,
  Video,
  Users,
  Clock,
  Sparkles,
  ArrowRight,
  Filter,
  Crown,
  Check,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { interviewTypes } from '@/lib/mock-data'

const practiceModes = [
  {
    id: 'text',
    name: 'Quick Text Practice',
    description: 'Fast Q&A practice without video. Perfect for quick sessions on the go.',
    icon: MessageSquare,
    duration: '15-30 min',
    features: ['Instant feedback', 'Text-based responses', 'All question types'],
    available: true,
    href: '/interview/setup?mode=text',
  },
  {
    id: 'video',
    name: 'AI Video Mock',
    description: 'Full simulation with camera. Practice your delivery and body language.',
    icon: Video,
    duration: '30-45 min',
    features: ['Video recording', 'Speech analysis', 'Posture feedback', 'Filler word detection'],
    available: false,
    premium: true,
    href: '/interview/setup?mode=video',
  },
  {
    id: 'peer',
    name: 'Peer Practice',
    description: 'Match with other job seekers for live practice sessions.',
    icon: Users,
    duration: '45-60 min',
    features: ['Live matching', 'Role switching', 'Mutual feedback', 'AI moderation'],
    available: false,
    premium: true,
    href: '/interview/peer-lobby',
  },
]

export default function PracticePage() {
  const router = useRouter()
  const [selectedType, setSelectedType] = useState<string>('all')

  const handleStartPractice = (mode: typeof practiceModes[0]) => {
    if (mode.premium && !mode.available) {
      router.push('/dashboard/pricing')
      return
    }
    router.push(mode.href)
  }

  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-5xl space-y-6">
        {/* Header */}
        <div>
          <h2 className="text-2xl font-bold">Choose Your Practice Mode</h2>
          <p className="mt-1 text-muted-foreground">
            Select how you&apos;d like to practice today
          </p>
        </div>

        {/* Practice Mode Cards */}
        <div className="grid gap-6 lg:grid-cols-3">
          {practiceModes.map((mode) => (
            <Card
              key={mode.id}
              className={`relative overflow-hidden ${
                mode.premium ? 'border-primary/30' : ''
              }`}
            >
              {mode.premium && (
                <div className="absolute right-0 top-0 rounded-bl-lg bg-primary px-3 py-1">
                  <div className="flex items-center gap-1 text-xs font-medium text-primary-foreground">
                    <Crown className="h-3 w-3" />
                    Pro
                  </div>
                </div>
              )}
              <CardHeader>
                <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary/10">
                  <mode.icon className="h-6 w-6 text-primary" />
                </div>
                <CardTitle className="mt-4">{mode.name}</CardTitle>
                <CardDescription>{mode.description}</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Clock className="h-4 w-4" />
                  <span>{mode.duration}</span>
                </div>
                <ul className="space-y-2">
                  {mode.features.map((feature) => (
                    <li key={feature} className="flex items-center gap-2 text-sm">
                      <Check className="h-4 w-4 text-success" />
                      {feature}
                    </li>
                  ))}
                </ul>
                <Button
                  className="w-full"
                  variant={mode.premium ? 'outline' : 'default'}
                  onClick={() => handleStartPractice(mode)}
                >
                  {mode.premium ? (
                    <>
                      <Sparkles className="mr-2 h-4 w-4" />
                      Unlock with Pro
                    </>
                  ) : (
                    <>
                      Start Practice
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Interview Type Filter */}
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <Filter className="h-5 w-5" />
                  Filter by Interview Type
                </CardTitle>
                <CardDescription>
                  Choose the type of questions you want to practice
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <Tabs value={selectedType} onValueChange={setSelectedType}>
              <TabsList className="grid w-full grid-cols-5">
                <TabsTrigger value="all">All</TabsTrigger>
                {interviewTypes.map((type) => (
                  <TabsTrigger key={type.value} value={type.value} className="capitalize">
                    {type.label}
                  </TabsTrigger>
                ))}
              </TabsList>
              <TabsContent value="all" className="mt-4">
                <p className="text-sm text-muted-foreground">
                  Practice with a mix of all question types for comprehensive preparation.
                </p>
              </TabsContent>
              {interviewTypes.map((type) => (
                <TabsContent key={type.value} value={type.value} className="mt-4">
                  <p className="text-sm text-muted-foreground">{type.description}</p>
                </TabsContent>
              ))}
            </Tabs>
          </CardContent>
        </Card>

        {/* Custom Session */}
        <Card>
          <CardHeader>
            <CardTitle>Custom Session</CardTitle>
            <CardDescription>
              Configure a personalized practice session with specific settings
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-center">
              <div className="flex items-center gap-4">
                <Badge variant="secondary">15-45 min</Badge>
                <Badge variant="secondary">Any difficulty</Badge>
                <Badge variant="secondary">Custom questions</Badge>
              </div>
              <Button variant="outline" asChild>
                <Link href="/interview/setup">
                  Configure Session
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}