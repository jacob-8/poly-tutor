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
      playlists: {
        Row: {
          created_at: string
          created_by: string
          id: string
          name: string
          public: string | null
        }
        Insert: {
          created_at?: string
          created_by?: string
          id?: string
          name: string
          public?: string | null
        }
        Update: {
          created_at?: string
          created_by?: string
          id?: string
          name?: string
          public?: string | null
        }
        Relationships: [
          {
            foreignKeyName: 'playlists_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          }
        ]
      }
      playlists_youtubes: {
        Row: {
          playlist_id: string
          youtube_id: string
        }
        Insert: {
          playlist_id: string
          youtube_id: string
        }
        Update: {
          playlist_id?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'playlists_youtubes_playlist_id_fkey'
            columns: ['playlist_id']
            isOneToOne: false
            referencedRelation: 'playlists'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'playlists_youtubes_youtube_id_fkey'
            columns: ['youtube_id']
            isOneToOne: false
            referencedRelation: 'youtubes'
            referencedColumns: ['id']
          }
        ]
      }
      user_youtubes: {
        Row: {
          added_at: string
          user_id: string
          youtube_id: string
        }
        Insert: {
          added_at?: string
          user_id?: string
          youtube_id: string
        }
        Update: {
          added_at?: string
          user_id?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'user_youtubes_user_id_fkey'
            columns: ['user_id']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'user_youtubes_youtube_id_fkey'
            columns: ['youtube_id']
            isOneToOne: false
            referencedRelation: 'youtubes'
            referencedColumns: ['id']
          }
        ]
      }
      youtube_channels: {
        Row: {
          description: string | null
          id: string
          thumbnail_id: string
          title: string
          updated_at: string
        }
        Insert: {
          description?: string | null
          id: string
          thumbnail_id: string
          title: string
          updated_at?: string
        }
        Update: {
          description?: string | null
          id?: string
          thumbnail_id?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      youtube_summaries: {
        Row: {
          created_at: string
          created_by: string
          description: string | null
          end_ms: number
          id: string
          start_ms: number
          summary: string
          title: string | null
          updated_at: string
          youtube_id: string
        }
        Insert: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_ms: number
          id?: string
          start_ms: number
          summary: string
          title?: string | null
          updated_at?: string
          youtube_id: string
        }
        Update: {
          created_at?: string
          created_by?: string
          description?: string | null
          end_ms?: number
          id?: string
          start_ms?: number
          summary?: string
          title?: string | null
          updated_at?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'youtube_summaries_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'youtube_summaries_youtube_id_fkey'
            columns: ['youtube_id']
            isOneToOne: false
            referencedRelation: 'youtubes'
            referencedColumns: ['id']
          }
        ]
      }
      youtube_transcripts: {
        Row: {
          captions_source: string | null
          created_at: string
          created_by: string
          description: string | null
          id: string
          transcript: Json | null
          updated_at: string
          youtube_id: string
        }
        Insert: {
          captions_source?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          transcript?: Json | null
          updated_at?: string
          youtube_id: string
        }
        Update: {
          captions_source?: string | null
          created_at?: string
          created_by?: string
          description?: string | null
          id?: string
          transcript?: Json | null
          updated_at?: string
          youtube_id?: string
        }
        Relationships: [
          {
            foreignKeyName: 'youtube_transcripts_created_by_fkey'
            columns: ['created_by']
            isOneToOne: false
            referencedRelation: 'users'
            referencedColumns: ['id']
          },
          {
            foreignKeyName: 'youtube_transcripts_youtube_id_fkey'
            columns: ['youtube_id']
            isOneToOne: false
            referencedRelation: 'youtubes'
            referencedColumns: ['id']
          }
        ]
      }
      youtubes: {
        Row: {
          channel_id: string
          created_at: string
          description: string | null
          duration_seconds: number | null
          id: string
          language: Database['public']['Enums']['language']
          title: string
        }
        Insert: {
          channel_id: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id: string
          language: Database['public']['Enums']['language']
          title: string
        }
        Update: {
          channel_id?: string
          created_at?: string
          description?: string | null
          duration_seconds?: number | null
          id?: string
          language?: Database['public']['Enums']['language']
          title?: string
        }
        Relationships: [
          {
            foreignKeyName: 'youtubes_channel_id_fkey'
            columns: ['channel_id']
            isOneToOne: false
            referencedRelation: 'youtube_channels'
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

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (Database['public']['Tables'] & Database['public']['Views'])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions['schema']]['Tables'] &
        Database[PublicTableNameOrOptions['schema']]['Views'])
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions['schema']]['Tables'] &
      Database[PublicTableNameOrOptions['schema']]['Views'])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (Database['public']['Tables'] &
      Database['public']['Views'])
  ? (Database['public']['Tables'] &
      Database['public']['Views'])[PublicTableNameOrOptions] extends {
      Row: infer R
    }
    ? R
    : never
  : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Insert: infer I
    }
    ? I
    : never
  : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof Database['public']['Tables']
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions['schema']]['Tables']
    : never = never
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions['schema']]['Tables'][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof Database['public']['Tables']
  ? Database['public']['Tables'][PublicTableNameOrOptions] extends {
      Update: infer U
    }
    ? U
    : never
  : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof Database['public']['Enums']
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions['schema']]['Enums']
    : never = never
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions['schema']]['Enums'][EnumName]
  : PublicEnumNameOrOptions extends keyof Database['public']['Enums']
  ? Database['public']['Enums'][PublicEnumNameOrOptions]
  : never

