// lib/ai.ts
// Persona-aware AI service — powered by OpenAI.
// Runs in Server Actions only — never import this in a Client Component.

import OpenAI from 'openai'
import { getPersona } from '@/lib/personas'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

// ─── Types ────────────────────────────────────────────────────────────────────

export interface GeneratedQuestion {
  index: number
  text: string
  type: 'technical' | 'behavioral' | 'general'
  hint?: string
}

export interface EvaluationResult {
  score: number
  feedback: string
  improvementTip: string
  rubricBreakdown: {
    clarity: number
    depth: number
    conciseness: number
    culturalFit: number
    starMethod: number
  }
}

export interface SessionConfig {
  personaId: string
  role: string
  difficulty: 'junior' | 'mid' | 'senior'
  questionTypes: Array<'technical' | 'behavioral' | 'general'>
  jobDescription?: string
  questionCount?: number
}

// ─── Helper ───────────────────────────────────────────────────────────────────

async function chat(system: string, user: string, maxTokens = 1500): Promise<string> {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',   // fast + cheap; swap to 'gpt-4o' for higher quality
    max_tokens: maxTokens,
    temperature: 0.7,
    messages: [
      { role: 'system', content: system },
      { role: 'user',   content: user },
    ],
  })
  return response.choices[0]?.message?.content ?? ''
}

// ─── Question generation ──────────────────────────────────────────────────────

export async function generateQuestions(config: SessionConfig): Promise<GeneratedQuestion[]> {
  const persona = getPersona(config.personaId)
  if (!persona) throw new Error(`Unknown persona: ${config.personaId}`)

  const questionCount = config.questionCount ?? 5
  const typeList = config.questionTypes.join(', ')
  const jdSection = config.jobDescription
    ? `\n\nJob description context (tailor questions to this role):\n"""\n${config.jobDescription}\n"""`
    : ''

  const prompt = `You are generating interview questions for a ${config.difficulty}-level ${config.role} candidate.
Question types to include (mix them): ${typeList}.
Number of questions: ${questionCount}.${jdSection}

Return ONLY a valid JSON array. No markdown, no explanation, no code fences.
Format exactly:
[
  {
    "index": 0,
    "text": "The full question text",
    "type": "technical|behavioral|general",
    "hint": "Optional 1-sentence coaching hint for the user (not shown during the question)"
  }
]`

  const raw = await chat(persona.systemPrompt, prompt, 1500)

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned) as GeneratedQuestion[]
  } catch {
    throw new Error(`Failed to parse questions from AI response: ${raw.slice(0, 200)}`)
  }
}

// ─── Answer evaluation ────────────────────────────────────────────────────────

export async function evaluateAnswer(params: {
  personaId: string
  role: string
  question: GeneratedQuestion
  answer: string
  timeTakenSeconds: number
}): Promise<EvaluationResult> {
  const persona = getPersona(params.personaId)
  if (!persona) throw new Error(`Unknown persona: ${params.personaId}`)

  const rubric = persona.rubric
  const timeNote = params.timeTakenSeconds > 0
    ? `The candidate took ${params.timeTakenSeconds} seconds to answer.`
    : ''

  const prompt = `You are evaluating a job interview answer for a ${params.role} candidate.

QUESTION (type: ${params.question.type}):
"${params.question.text}"

CANDIDATE'S ANSWER:
"${params.answer || '[No answer provided — candidate did not respond]'}"

${timeNote}

Score this answer using these exact rubric weights (weights sum to 100):
- Clarity: ${rubric.clarity} points
- Depth: ${rubric.depth} points
- Conciseness: ${rubric.conciseness} points
- Cultural fit signals: ${rubric.culturalFit} points
- STAR method structure: ${rubric.starMethod} points

Return ONLY a valid JSON object. No markdown, no explanation, no code fences:
{
  "score": <0-100 integer>,
  "feedback": "<2-3 sentences assessing the answer>",
  "improvementTip": "<1 specific actionable sentence>",
  "rubricBreakdown": {
    "clarity": <0-${rubric.clarity}>,
    "depth": <0-${rubric.depth}>,
    "conciseness": <0-${rubric.conciseness}>,
    "culturalFit": <0-${rubric.culturalFit}>,
    "starMethod": <0-${rubric.starMethod}>
  }
}`

  const raw = await chat(persona.systemPrompt, prompt, 600)

  try {
    const cleaned = raw.replace(/```json|```/g, '').trim()
    return JSON.parse(cleaned) as EvaluationResult
  } catch {
    throw new Error(`Failed to parse evaluation: ${raw.slice(0, 200)}`)
  }
}

// ─── JD skill extractor (Pro) ─────────────────────────────────────────────────

export async function extractJobSkills(jobDescription: string): Promise<{
  role: string
  skills: string[]
  questionFocus: string[]
}> {
  const prompt = `Extract structured data from this job description.

JOB DESCRIPTION:
"${jobDescription}"

Return ONLY valid JSON. No markdown:
{
  "role": "<inferred role title>",
  "skills": ["<skill 1>", "<skill 2>", ...],
  "questionFocus": ["<area to focus on>", ...]
}`

  const raw = await chat('You are a job description analyser. Return only valid JSON.', prompt, 500)
  const cleaned = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}

// ─── Session summary ──────────────────────────────────────────────────────────

export async function generateSessionSummary(params: {
  personaId: string
  role: string
  answers: Array<{ question: string; answer: string; score: number; feedback: string }>
  overallScore: number
}): Promise<{
  headline: string
  strengths: string[]
  improvements: string[]
  nextSteps: string
}> {
  const persona = getPersona(params.personaId)
  const personaName = persona?.name ?? 'your interviewer'

  const answersText = params.answers
    .map((a, i) => `Q${i + 1}: ${a.question}\nAnswer: ${a.answer}\nScore: ${a.score}/100\nFeedback: ${a.feedback}`)
    .join('\n\n')

  const prompt = `You are summarising a completed interview practice session.

Role: ${params.role}
Interviewer persona: ${personaName}
Overall score: ${params.overallScore}/100

Session answers and feedback:
${answersText}

Return ONLY valid JSON:
{
  "headline": "<one sentence overall assessment>",
  "strengths": ["<strength 1>", "<strength 2>", "<strength 3>"],
  "improvements": ["<improvement 1>", "<improvement 2>", "<improvement 3>"],
  "nextSteps": "<1-2 sentences on what to practise next>"
}`

  const raw = await chat('You are an interview coach. Return only valid JSON.', prompt, 600)
  const cleaned = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(cleaned)
}