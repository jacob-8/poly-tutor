export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      youtubes: {
        Row: {
          channel_id: string
          channel_thumbnail_url: string
          channel_title: string
          created_at: string
          created_by: string
          duration_seconds: number | null
          id: string
          language: Database['public']['Enums']['language']
          summaries: Json | null
          thumbnail_url: string | null
          title: string
          transcripts: Json | null
          updated_at: string
        }
        Insert: {
          channel_id: string
          channel_thumbnail_url: string
          channel_title: string
          created_at?: string
          created_by: string
          duration_seconds?: number | null
          id: string
          language: Database['public']['Enums']['language']
          summaries?: Json | null
          thumbnail_url?: string | null
          title: string
          transcripts?: Json | null
          updated_at?: string
        }
        Update: {
          channel_id?: string
          channel_thumbnail_url?: string
          channel_title?: string
          created_at?: string
          created_by?: string
          duration_seconds?: number | null
          id?: string
          language?: Database['public']['Enums']['language']
          summaries?: Json | null
          thumbnail_url?: string | null
          title?: string
          transcripts?: Json | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: 'youtube_created_by_fkey'
            columns: ['created_by']
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      language: 'en' | 'zh'
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

