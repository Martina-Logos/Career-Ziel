# CareerZiel

CareerZiel is an AI-powered interview preparation platform built with Next.js. It delivers mock interview sessions, real-time answer evaluation, progress analytics, and Supabase-backed authentication and session storage.

## What this project includes

- **Next.js 16 App Router** with React 19 and TypeScript
- **Supabase authentication** and user session management
- **OpenAI integration** for interview question generation, answer evaluation, and session summaries
- **Server Actions** for secure AI calls and database writes
- **Responsive UI** using custom components and Tailwind-compatible styles
- **Protected route middleware** via `proxy.ts` for auth-based redirects

## Key features

- AI-generated interview questions by persona, role, difficulty, and job description
- Answer evaluation with feedback, rubric breakdown, and improvement tips
- Completed session summaries and analytics dashboard
- Email/password sign-up, login, password reset, and protected user areas
- Profile setup and user settings stored in Supabase
- Promotional landing page with feature highlights and pricing teaser

## Tech stack

- `next` 16.2.4
- `react` 19.2.4
- `typescript` 5
- `@supabase/ssr` and `@supabase/supabase-js`
- `openai` for AI completion and evaluation
- `date-fns`, `recharts`, `lucide-react`, `sonner`
- `@radix-ui` for UI primitives

## Getting started

### 1. Clone the repo

```bash
git clone <repo-url>
cd career_ziel
```

### 2. Install dependencies

```bash
npm install
```

### 3. Add environment variables

Create a `.env.local` file in the project root and define the following values:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-url.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
OPENAI_API_KEY=your-openai-api-key
```

> Note: This app currently expects OpenAI as the AI provider. The `@anthropic-ai/sdk` dependency is present in `package.json`, but the active AI logic in `lib/ai.ts` uses the OpenAI SDK.

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project structure

- `app/`
  - `page.tsx` — landing page and marketing experience
  - `auth/` — login, signup, callback handling, auth actions
  - `dashboard/` — logged-in user dashboard
  - `practice/` — interview session setup, live practice, feedback
  - `analytics/` — session analytics and user performance insights
  - `profile-setup/` — onboarding profile capture
  - `settings/` — account preferences and sign out
- `components/ui/` — reusable UI primitives and layout components
- `hooks/` — custom hooks such as `useDashboard` and `useUser`
- `lib/`
  - `ai.ts` — AI question generation and answer evaluation logic
  - `supabase/` — Supabase browser and server clients plus DB types
  - `personas.ts` — interviewer personas and prompts
- `proxy.ts` — middleware-style route guarding for protected pages
- `types/` — shared TypeScript interfaces

## Important files

- `lib/ai.ts` — central AI service; runs server-side only
- `lib/supabase/client.ts` — browser-side Supabase client
- `lib/supabase/server.ts` — server-side Supabase client for actions
- `app/practice/actions.ts` — server actions for starting, submitting, and completing practice sessions
- `proxy.ts` — redirects unauthenticated requests away from protected routes

## How auth works

- Client components use `createClient()` from `lib/supabase/client.ts`
- Server Actions and server components use `createClient()` from `lib/supabase/server.ts`
- `proxy.ts` checks user auth before allowing access to `/dashboard`, `/practice`, `/analytics`, `/settings`, and `/profile-setup`
- `app/auth/callback/route.ts` handles Supabase email confirmation callbacks and token exchange

## AI behavior

`lib/ai.ts` contains all AI-related business logic and uses these functions:

- `generateQuestions()` — creates interview questions based on persona, role, difficulty, and optional job description
- `evaluateAnswer()` — scores answers and returns feedback plus rubric breakdown
- `extractJobSkills()` — parses a job description into skills and focus areas
- `generateSessionSummary()` — summarizes completed sessions

All AI calls are performed server-side to keep API keys safe.

## Deployment

This project is ready for deployment to any platform that supports Next.js 16 and environment variables.

### Recommended deployment steps

1. Build the app:
   ```bash
   npm run build
   ```
2. Start the production server:
   ```bash
   npm run start
   ```

### Environment variables in production

Set the same values as local development:

- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `OPENAI_API_KEY`

## Development notes

- The app relies on Supabase DB tables such as `users`, `sessions`, `session_answers`, and any custom RPCs like `update_streak`.
- `app/practice/actions.ts` writes session state and answer scoring to Supabase.
- `proxy.ts` is a route guard and must remain enabled to protect signed-in pages.
- `app/page.tsx` is the public landing page and not protected by auth.

## Troubleshooting

- If auth redirects fail, verify `NEXT_PUBLIC_SUPABASE_URL` and `NEXT_PUBLIC_SUPABASE_ANON_KEY`.
- If AI calls fail, verify `OPENAI_API_KEY` and that the key has permission to use `gpt-4o-mini`.
- If pages render with missing data, ensure your Supabase schema matches the application queries.

## License

This repository does not include a license file. Add one if you want to open source the project.
