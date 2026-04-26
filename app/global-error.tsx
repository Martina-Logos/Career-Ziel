'use client'

import { useState, useCallback, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import useEmblaCarousel from 'embla-carousel-react'
import { Video, Zap, TrendingUp, Users, ArrowRight, ArrowLeft } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { welcomeSlides } from '@/lib/mock-data'

const iconMap: Record<string, React.ElementType> = {
  video: Video,
  zap: Zap,
  'trending-up': TrendingUp,
  users: Users,
}

export default function WelcomePage() {
  const router = useRouter()
  const [emblaRef, emblaApi] = useEmblaCarousel()
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [canScrollPrev, setCanScrollPrev] = useState(false)
  const [canScrollNext, setCanScrollNext] = useState(true)

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi])
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi])
  const scrollTo = useCallback((index: number) => emblaApi?.scrollTo(index), [emblaApi])

  const onSelect = useCallback(() => {
    if (!emblaApi) return
    setSelectedIndex(emblaApi.selectedScrollSnap())
    setCanScrollPrev(emblaApi.canScrollPrev())
    setCanScrollNext(emblaApi.canScrollNext())
  }, [emblaApi])

  useEffect(() => {
    if (!emblaApi) return
    onSelect()
    emblaApi.on('select', onSelect)
    emblaApi.on('reInit', onSelect)
    return () => {
      emblaApi.off('select', onSelect)
      emblaApi.off('reInit', onSelect)
    }
  }, [emblaApi, onSelect])

  const handleFinish = () => {
    router.push('/profile-setup')
  }

  const handleSkip = () => {
    router.push('/profile-setup')
  }

  const isLastSlide = selectedIndex === welcomeSlides.length - 1

  return (
    <div className="flex min-h-screen flex-col bg-background">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-4">
        <div className="flex items-center gap-2">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary">
            <Zap className="h-5 w-5 text-primary-foreground" />
          </div>
          <span className="text-xl font-bold">InterviewAI</span>
        </div>
        <Button variant="ghost" onClick={handleSkip}>
          Skip
        </Button>
      </div>

      {/* Carousel */}
      <div className="flex flex-1 flex-col items-center justify-center px-4">
        <div className="w-full max-w-lg overflow-hidden" ref={emblaRef}>
          <div className="flex">
            {welcomeSlides.map((slide) => {
              const Icon = iconMap[slide.icon] || Zap
              return (
                <div
                  key={slide.id}
                  className="min-w-0 flex-[0_0_100%]"
                >
                  <div className="flex flex-col items-center px-4 text-center">
                    <div className="mb-8 flex h-24 w-24 items-center justify-center rounded-2xl bg-primary/10">
                      <Icon className="h-12 w-12 text-primary" />
                    </div>
                    <h2 className="text-2xl font-bold sm:text-3xl">{slide.title}</h2>
                    <p className="mt-4 max-w-md text-lg text-muted-foreground">
                      {slide.description}
                    </p>
                  </div>
                </div>
              )
            })}
          </div>
        </div>

        {/* Progress Dots */}
        <div className="mt-12 flex gap-2">
          {welcomeSlides.map((_, index) => (
            <button
              key={index}
              onClick={() => scrollTo(index)}
              className={`h-2 rounded-full transition-all ${
                index === selectedIndex
                  ? 'w-8 bg-primary'
                  : 'w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

        {/* Navigation Buttons */}
        <div className="mt-8 flex items-center gap-4">
          <Button
            variant="outline"
            size="icon"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
          >
            <ArrowLeft className="h-4 w-4" />
          </Button>
          
          {isLastSlide ? (
            <Button size="lg" onClick={handleFinish}>
              Get Started
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          ) : (
            <Button size="lg" onClick={scrollNext} disabled={!canScrollNext}>
              Next
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      </div>
    </div>
  )
}
