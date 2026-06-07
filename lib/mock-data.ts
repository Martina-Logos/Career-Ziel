export const industries = [
  'Technology',
  'Finance',
  'Healthcare',
  'Education',
  'Consulting',
  'Retail',
  'Manufacturing',
]

export const interviewTypes = [
  { value: 'behavioral', label: 'Behavioral', description: 'STAR stories and culture fit' },
  { value: 'technical', label: 'Technical', description: 'Role-specific technical depth' },
  { value: 'case-study', label: 'Case Study', description: 'Structured problem solving' },
  { value: 'mixed', label: 'Mixed', description: 'Balanced full interview practice' },
] as const

export const mockUser = {
  targetRole: 'Product Manager',
  experienceLevel: 'mid-level',
  industry: 'Technology',
}

export const mockPeerMatch = {
  peerName: 'Jordan Lee',
  peerRole: 'Senior Product Manager',
  peerRating: 4.8,
  peerExperience: 'senior',
}

export const mockQuestions = [
  {
    id: 'q1',
    text: 'Tell me about a time you led a project with ambiguous requirements.',
    category: 'behavioral',
    difficulty: 'medium',
    timeLimit: 180,
  },
  {
    id: 'q2',
    text: 'How would you prioritize features when engineering capacity is limited?',
    category: 'product',
    difficulty: 'medium',
    timeLimit: 180,
  },
  {
    id: 'q3',
    text: 'Describe a technical tradeoff you had to explain to a non-technical stakeholder.',
    category: 'technical',
    difficulty: 'hard',
    timeLimit: 210,
  },
  {
    id: 'q4',
    text: 'What metrics would you use to evaluate a new onboarding flow?',
    category: 'analytics',
    difficulty: 'medium',
    timeLimit: 180,
  },
  {
    id: 'q5',
    text: 'Why are you interested in this role, and what would you focus on in your first 90 days?',
    category: 'general',
    difficulty: 'easy',
    timeLimit: 150,
  },
]

export const mockSessions = [
  {
    id: 'session-1',
    role: 'Product Manager',
    company: 'CareerZiel Demo',
    type: 'behavioral',
    mode: 'text',
    difficulty: 'medium',
    duration: 30,
    overallScore: 78,
    date: new Date('2026-06-01'),
  },
  {
    id: 'session-2',
    role: 'Frontend Developer',
    company: 'CareerZiel Demo',
    type: 'technical',
    mode: 'video',
    difficulty: 'hard',
    duration: 45,
    overallScore: 84,
    date: new Date('2026-05-24'),
  },
]
