export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      emotional_recognitions: {
        Row: {
          category_id: string | null
          created_at: string
          id: string
          is_read: boolean
          message: string
          receiver_id: string
          recognition_date: string
          sender_id: string
        }
        Insert: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          receiver_id: string
          recognition_date?: string
          sender_id: string
        }
        Update: {
          category_id?: string | null
          created_at?: string
          id?: string
          is_read?: boolean
          message?: string
          receiver_id?: string
          recognition_date?: string
          sender_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "emotional_recognitions_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "recognition_categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_receiver"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_receiver_profile"
            columns: ["receiver_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "fk_sender_profile"
            columns: ["sender_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      garden_checkins: {
        Row: {
          achievements: number
          check_in_date: string
          created_at: string
          energy: number
          exceptional_day: number
          id: string
          mental_pressure: number
          personal_concerns: number
          teragesto_accepted: boolean | null
          teragesto_shown: string | null
          user_id: string
          weather: string
        }
        Insert: {
          achievements: number
          check_in_date?: string
          created_at?: string
          energy: number
          exceptional_day: number
          id?: string
          mental_pressure: number
          personal_concerns: number
          teragesto_accepted?: boolean | null
          teragesto_shown?: string | null
          user_id: string
          weather: string
        }
        Update: {
          achievements?: number
          check_in_date?: string
          created_at?: string
          energy?: number
          exceptional_day?: number
          id?: string
          mental_pressure?: number
          personal_concerns?: number
          teragesto_accepted?: boolean | null
          teragesto_shown?: string | null
          user_id?: string
          weather?: string
        }
        Relationships: []
      }
      ia_feedback: {
        Row: {
          accion_recomendada: string | null
          analisis_ia: string | null
          fecha: string | null
          id: string
          uuid: string
        }
        Insert: {
          accion_recomendada?: string | null
          analisis_ia?: string | null
          fecha?: string | null
          id?: string
          uuid: string
        }
        Update: {
          accion_recomendada?: string | null
          analisis_ia?: string | null
          fecha?: string | null
          id?: string
          uuid?: string
        }
        Relationships: []
      }
      recognition_categories: {
        Row: {
          emoji: string
          id: string
          name: string
          plant: string
        }
        Insert: {
          emoji: string
          id: string
          name: string
          plant: string
        }
        Update: {
          emoji?: string
          id?: string
          name?: string
          plant?: string
        }
        Relationships: []
      }
      recognitions: {
        Row: {
          created_at: string | null
          id: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Insert: {
          created_at?: string | null
          id?: string
          message: string
          receiver_id: string
          sender_id: string
        }
        Update: {
          created_at?: string | null
          id?: string
          message?: string
          receiver_id?: string
          sender_id?: string
        }
        Relationships: []
      }
      team_members: {
        Row: {
          created_at: string | null
          id: string
          team_id: string | null
          user_id: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          team_id?: string | null
          user_id?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          team_id?: string | null
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "fk_user_profile"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_team_id_fkey"
            columns: ["team_id"]
            isOneToOne: false
            referencedRelation: "teams"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "team_members_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "user_profiles"
            referencedColumns: ["id"]
          },
        ]
      }
      teams: {
        Row: {
          id: string
          name: string
        }
        Insert: {
          id: string
          name: string
        }
        Update: {
          id?: string
          name?: string
        }
        Relationships: []
      }
      user_profiles: {
        Row: {
          created_at: string
          id: string
          name: string | null
          onboarding_complete: boolean | null
          role: string | null
        }
        Insert: {
          created_at?: string
          id: string
          name?: string | null
          onboarding_complete?: boolean | null
          role?: string | null
        }
        Update: {
          created_at?: string
          id?: string
          name?: string | null
          onboarding_complete?: boolean | null
          role?: string | null
        }
        Relationships: []
      }
      weather_emotions: {
        Row: {
          created_at: string
          emotion: string
          id: string
          user_id: string
          weather: string
        }
        Insert: {
          created_at?: string
          emotion: string
          id?: string
          user_id: string
          weather: string
        }
        Update: {
          created_at?: string
          emotion?: string
          id?: string
          user_id?: string
          weather?: string
        }
        Relationships: []
      }
    }
    Views: {
      team_emotional_data: {
        Row: {
          avg_achievements: number | null
          avg_energy: number | null
          avg_exceptional_day: number | null
          avg_mental_pressure: number | null
          avg_personal_concerns: number | null
          check_in_date: string | null
          member_count: number | null
          most_common_weather: string | null
          role: string | null
        }
        Relationships: []
      }
      team_emotional_demo: {
        Row: {
          avg_achievements: number | null
          avg_energy: number | null
          avg_exceptional_day: number | null
          avg_mental_pressure: number | null
          avg_personal_concerns: number | null
          check_in_date: string | null
          member_count: number | null
          most_common_weather: string | null
          role: string | null
        }
        Relationships: []
      }
      user_emotional_data: {
        Row: {
          achievements: number | null
          check_in_date: string | null
          created_at: string | null
          energy: number | null
          exceptional_day: number | null
          id: string | null
          mental_pressure: number | null
          personal_concerns: number | null
          teragesto_accepted: boolean | null
          teragesto_shown: string | null
          user_id: string | null
          weather: string | null
          weather_emotion: string | null
        }
        Relationships: []
      }
    }
    Functions: {
      get_team_emotional_demo: {
        Args: Record<PropertyKey, never>
        Returns: {
          avg_achievements: number | null
          avg_energy: number | null
          avg_exceptional_day: number | null
          avg_mental_pressure: number | null
          avg_personal_concerns: number | null
          check_in_date: string | null
          member_count: number | null
          most_common_weather: string | null
          role: string | null
        }[]
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
