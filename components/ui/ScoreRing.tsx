'use client'
import { useEffect, useRef } from 'react'
import { getScoreLabel } from '@/lib/utils'

interface ScoreRingProps {
  score: number
  size?: number
  strokeWidth?: number
  label?: string
}

export default function ScoreRing({ score, size = 120, strokeWidth = 8, label }: ScoreRingProps) {
  const ringRef = useRef<SVGCircleElement>(null)
  const radius = (size - strokeWidth) / 2
  const circumference = 2 * Math.PI * radius

  const color = score >= 80 ? '#00d4aa' : score >= 60 ? '#f4a832' : '#ff5f5f'

  useEffect(() => {
    if (ringRef.current) {
      const offset = circumference - (score / 100) * circumference
      ringRef.current.style.strokeDashoffset = String(offset)
    }
  }, [score, circumference])

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: size, height: size }}>
        <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} className="-rotate-90">
          <circle
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke="var(--color-cz-surface3)"
            strokeWidth={strokeWidth}
          />
          <circle
            ref={ringRef}
            cx={size / 2} cy={size / 2} r={radius}
            fill="none"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={circumference}
            style={{ transition: 'stroke-dashoffset 1.2s cubic-bezier(0.4, 0, 0.2, 1)' }}
          />
        </svg>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
          <span className="font-syne font-700 text-2xl leading-none" style={{ color }}>
            {score}
          </span>
          <span className="text-[10px] text-[var(--color-cz-muted)] mt-0.5">/ 100</span>
        </div>
      </div>
      {label !== undefined && (
        <span className="text-xs font-medium" style={{ color }}>
          {label || getScoreLabel(score)}
        </span>
      )}
    </div>
  )
}