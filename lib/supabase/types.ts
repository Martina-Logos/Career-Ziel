// lib/supabase/types.ts — generated type-safe DB interface
export type Database = {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          email: string
          full_name: string | null
          avatar_url: string | null
          target_role: string | null
          experience_level: string | null
          industry: string | null
          cv_url: string | null
          bio: string | null
          plan: string
          streak: number
          last_active_at: string | null
          created_at: string
          updated_at: string
        }
        Insert: Partial<Database['public']['Tables']['users']['Row']> & { id: string; email: string }
        Update: Partial<Database['public']['Tables']['users']['Row']>
      }
      sessions: {
        Row: {
          id: string
          user_id: string
          role: string
          difficulty: string
          question_types: string[]
          job_description: string | null
          overall_score: number | null
          status: string
          duration_secs: number | null
          created_at: string
          completed_at: string | null
        }
        Insert: Omit<Database['public']['Tables']['sessions']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['sessions']['Row']>
      }
      session_answers: {
        Row: {
          id: string
          session_id: string
          user_id: string
          question_index: number
          question_text: string
          question_type: string
          answer_text: string | null
          score: number | null
          ai_feedback: string | null
          improvement_tip: string | null
          time_taken_secs: number | null
          created_at: string
        }
        Insert: Omit<Database['public']['Tables']['session_answers']['Row'], 'id' | 'created_at'>
        Update: Partial<Database['public']['Tables']['session_answers']['Row']>
      }
    }
    Functions: {
      update_streak: { Args: { p_user_id: string }; Returns: void }
    }
  }
}