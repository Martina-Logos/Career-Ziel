'use client'

import {
  TrendingUp,
  Trophy,
  Target,
  Calendar,
  Flame,
  Star,
  Award,
  Clock,
  Users,
  Video,
  Sparkles,
} from 'lucide-react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { mockAnalytics, mockAchievements, mockUser } from '@/lib/mock-data'

const recommendations = [
  {
    title: 'Practice Technical Questions',
    description: 'Your technical accuracy is at 76%. Focus on system design and coding questions.',
    priority: 'high',
    action: 'Start Technical Mock',
  },
  {
    title: 'Try Video Mode',
    description: 'Video practice helps improve confidence and body language.',
    priority: 'medium',
    action: 'Upgrade to Pro',
  },
  {
    title: 'Complete Daily Practice',
    description: 'Maintain your 7-day streak by practicing today.',
    priority: 'low',
    action: 'Quick Practice',
  },
]

const studyPlan = [
  { day: 'Mon', completed: true, type: 'Behavioral' },
  { day: 'Tue', completed: true, type: 'Technical' },
  { day: 'Wed', completed: true, type: 'Mixed' },
  { day: 'Thu', completed: false, type: 'Case Study', current: true },
  { day: 'Fri', completed: false, type: 'Behavioral' },
  { day: 'Sat', completed: false, type: 'Technical' },
  { day: 'Sun', completed: false, type: 'Rest' },
]

const achievementIcons: Record<string, React.ElementType> = {
  trophy: Trophy,
  flame: Flame,
  star: Star,
  video: Video,
  users: Users,
  clock: Clock,
}

export default function ProgressPage() {
  return (
    <div className="p-4 lg:p-6">
      <div className="mx-auto max-w-7xl space-y-6">
        {/* Header */}
        <div>
          <h1 className="text-2xl font-bold">Progress Tracker</h1>
          <p className="text-muted-foreground">Monitor your improvement and set goals</p>
        </div>

        {/* Overview Stats */}
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                <Flame className="h-6 w-6 text-primary" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Current Streak</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{mockAnalytics.currentStreak}</p>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-success/10">
                <Trophy className="h-6 w-6 text-success" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Longest Streak</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">{mockAnalytics.longestStreak}</p>
                  <span className="text-sm text-muted-foreground">days</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-2/10">
                <TrendingUp className="h-6 w-6 text-chart-2" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Improvement</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold text-success">+13%</p>
                  <span className="text-sm text-muted-foreground">this month</span>
                </div>
              </div>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="flex items-center gap-4 py-4">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-chart-4/10">
                <Target className="h-6 w-6 text-chart-4" />
              </div>
              <div>
                <p className="text-sm text-muted-foreground">Goal Progress</p>
                <div className="flex items-baseline gap-2">
                  <p className="text-2xl font-bold">78%</p>
                  <span className="text-sm text-muted-foreground">to 90</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Skill Mastery */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="h-5 w-5" />
                Skill Mastery
              </CardTitle>
              <CardDescription>Your progress in each skill area</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {mockAnalytics.skillProgress.map((skill) => {
                const improvement = skill.currentScore - skill.previousScore
                return (
                  <div key={skill.skill}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{skill.skill}</span>
                        {improvement > 0 && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            +{improvement}%
                          </Badge>
                        )}
                      </div>
                      <span className="text-sm font-bold">{skill.currentScore}%</span>
                    </div>
                    <div className="relative">
                      <Progress value={skill.currentScore} className="h-3" />
                      <div
                        className="absolute top-0 h-3 w-0.5 bg-muted-foreground"
                        style={{ left: `${skill.targetScore}%` }}
                      />
                    </div>
                    <div className="mt-1 flex justify-between text-xs text-muted-foreground">
                      <span>{skill.sessionsCount} practice sessions</span>
                      <span>Target: {skill.targetScore}%</span>
                    </div>
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* AI Recommendations */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Sparkles className="h-5 w-5 text-primary" />
                AI Recommendations
              </CardTitle>
              <CardDescription>Personalized next steps</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {recommendations.map((rec, index) => (
                <div
                  key={index}
                  className="rounded-lg border p-4"
                >
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="font-medium">{rec.title}</h4>
                    <Badge
                      variant={
                        rec.priority === 'high'
                          ? 'destructive'
                          : rec.priority === 'medium'
                          ? 'default'
                          : 'secondary'
                      }
                    >
                      {rec.priority}
                    </Badge>
                  </div>
                  <p className="mb-3 text-sm text-muted-foreground">{rec.description}</p>
                  <Button size="sm" variant="outline" className="w-full">
                    {rec.action}
                  </Button>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        {/* Achievements */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Achievements
            </CardTitle>
            <CardDescription>Badges you&apos;ve earned and goals to unlock</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {mockAchievements.map((achievement) => {
                const Icon = achievementIcons[achievement.icon] || Trophy
                return (
                  <div
                    key={achievement.id}
                    className={`flex items-center gap-4 rounded-lg border p-4 ${
                      achievement.isUnlocked ? 'bg-primary/5' : 'opacity-60'
                    }`}
                  >
                    <div
                      className={`flex h-12 w-12 items-center justify-center rounded-full ${
                        achievement.isUnlocked ? 'bg-primary/10' : 'bg-muted'
                      }`}
                    >
                      <Icon
                        className={`h-6 w-6 ${
                          achievement.isUnlocked ? 'text-primary' : 'text-muted-foreground'
                        }`}
                      />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium">{achievement.title}</h4>
                        {achievement.isUnlocked && (
                          <Badge variant="secondary" className="bg-success/10 text-success">
                            Unlocked
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground">{achievement.description}</p>
                      {!achievement.isUnlocked && achievement.progress !== undefined && (
                        <div className="mt-2">
                          <Progress
                            value={(achievement.progress / (achievement.target || 1)) * 100}
                            className="h-1.5"
                          />
                          <span className="text-xs text-muted-foreground">
                            {achievement.progress}/{achievement.target}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>
                )
              })}
            </div>
          </CardContent>
        </Card>

        {/* Study Plan Calendar */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              Weekly Study Plan
            </CardTitle>
            <CardDescription>Your recommended practice schedule</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-2">
              {studyPlan.map((day) => (
                <div
                  key={day.day}
                  className={`rounded-lg border p-4 text-center ${
                    day.current
                      ? 'border-primary bg-primary/5'
                      : day.completed
                      ? 'bg-success/5'
                      : ''
                  }`}
                >
                  <p className="text-sm font-medium">{day.day}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{day.type}</p>
                  {day.completed && (
                    <Badge variant="secondary" className="mt-2 bg-success/10 text-success">
                      Done
                    </Badge>
                  )}
                  {day.current && (
                    <Badge className="mt-2">Today</Badge>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Comparison */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              How You Compare
            </CardTitle>
            <CardDescription>Your performance vs. average users</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-6 sm:grid-cols-3">
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Score</p>
                <p className="text-3xl font-bold text-primary">{mockAnalytics.averageScore}%</p>
                <p className="text-sm text-muted-foreground">Average: 72%</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Sessions</p>
                <p className="text-3xl font-bold">{mockAnalytics.totalSessions}</p>
                <p className="text-sm text-muted-foreground">Average: 15</p>
              </div>
              <div className="text-center">
                <p className="text-sm text-muted-foreground">Your Streak</p>
                <p className="text-3xl font-bold">{mockAnalytics.currentStreak} days</p>
                <p className="text-sm text-muted-foreground">Average: 3 days</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
