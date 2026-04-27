import { Question, QuestionFeedback, InterviewType, Difficulty } from '@/types'

const ANTHROPIC_API = 'https://api.anthropic.com/v1/messages'
const MODEL = 'claude-sonnet-4-20250514'

async function callClaude(prompt: string, systemPrompt?: string): Promise<string> {
  const messages = [{ role: 'user', content: prompt }]
  const body: Record<string, unknown> = { model: MODEL, max_tokens: 1000, messages }
  if (systemPrompt) body.system = systemPrompt

  const res = await fetch(ANTHROPIC_API, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
  if (!res.ok) throw new Error(`API error: ${res.status}`)
  const data = await res.json()
  return data.content?.map((c: { type: string; text?: string }) => c.text || '').join('') || ''
}

function parseJSON<T>(raw: string): T {
  const clean = raw.replace(/```json|```/g, '').trim()
  return JSON.parse(clean)
}

export async function generateQuestions(
  role: string,
  industry: string,
  types: InterviewType[],
  difficulty: Difficulty,
  count = 5,
  jobDescription?: string
): Promise<Question[]> {
  const jdContext = jobDescription
    ? `\n\nJob Description context:\n${jobDescription.slice(0, 800)}`
    : ''

  const prompt = `Generate exactly ${count} interview questions for a ${difficulty} ${role} position in ${industry}.
Question types to include (mix them): ${types.join(', ')}.${jdContext}

Respond ONLY with valid JSON:
{"questions":[{"id":"q1","text":"...","type":"behavioral|technical|general","hint":"One-line answering tip","difficulty":"${difficulty}"}]}`

  const raw = await callClaude(prompt)
  const parsed = parseJSON<{ questions: Question[] }>(raw)
  return parsed.questions
}

export async function evaluateAnswer(
  question: Question,
  answer: string,
  role: string,
  difficulty: Difficulty
): Promise<QuestionFeedback> {
  const prompt = `Evaluate this interview answer for a ${difficulty} ${role} position.

Question (${question.type}): ${question.text}
Answer: "${answer}"

Respond ONLY with valid JSON:
{"questionId":"${question.id}","score":75,"clarity":70,"confidence":80,"relevance":75,"technicalAccuracy":70,"strengths":"One specific strength","improvements":"One concrete improvement","summary":"2-sentence overall assessment"}`

  const raw = await callClaude(prompt)
  return parseJSON<QuestionFeedback>(raw)
}

export async function extractJobDescriptionSkills(jdText: string): Promise<{
  skills: string[]
  qualifications: string[]
  title: string
  company: string
}> {
  const prompt = `Extract key information from this job description.

${jdText.slice(0, 1500)}

Respond ONLY with valid JSON:
{"title":"Job Title","company":"Company Name","skills":["skill1","skill2"],"qualifications":["qual1","qual2"]}`

  const raw = await callClaude(prompt)
  return parseJSON(raw)
}