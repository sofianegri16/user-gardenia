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
          created_at: string
          id: string
          is_read: boolean
          message: string
          receiver_id: string
          recognition_date: string
          sender_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          is_read?: boolean
          message: string
          receiver_id: string
          recognition_date?: string
          sender_id: string
        }
        Update: {
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
            foreignKeyName: "fk_receiver_profile"
            columns: ["receiver_id"]
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never
