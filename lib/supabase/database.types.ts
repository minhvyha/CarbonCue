export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "14.18"
  }
  public: {
    Tables: {
      activity_logs: {
        Row: {
          activity_date: string
          activity_details: Json
          activity_type: string
          created_at: string
          factor_version: string
          id: string
          method: string
          model_version: string | null
          notes: string
          prediction: number
          timezone: string
          user_id: string
        }
        Insert: {
          activity_date: string
          activity_details: Json
          activity_type: string
          created_at?: string
          factor_version: string
          id?: string
          method: string
          model_version?: string | null
          notes?: string
          prediction: number
          timezone?: string
          user_id?: string
        }
        Update: {
          activity_date?: string
          activity_details?: Json
          activity_type?: string
          created_at?: string
          factor_version?: string
          id?: string
          method?: string
          model_version?: string | null
          notes?: string
          prediction?: number
          timezone?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "activity_logs_factor_version_fkey"
            columns: ["factor_version"]
            isOneToOne: false
            referencedRelation: "emission_factor_versions"
            referencedColumns: ["version"]
          },
          {
            foreignKeyName: "activity_logs_model_version_fkey"
            columns: ["model_version"]
            isOneToOne: false
            referencedRelation: "model_versions"
            referencedColumns: ["version"]
          },
        ]
      }
      artwork_likes: {
        Row: {
          resource_id: string
          user_id: string
        }
        Insert: {
          resource_id: string
          user_id?: string
        }
        Update: {
          resource_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_likes_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: false
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      artwork_stats: {
        Row: {
          likes_count: number
          resource_id: string
        }
        Insert: {
          likes_count?: number
          resource_id: string
        }
        Update: {
          likes_count?: number
          resource_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "artwork_stats_resource_id_fkey"
            columns: ["resource_id"]
            isOneToOne: true
            referencedRelation: "resources"
            referencedColumns: ["id"]
          },
        ]
      }
      emission_factor_versions: {
        Row: {
          created_at: string
          metadata: Json
          version: string
        }
        Insert: {
          created_at?: string
          metadata: Json
          version: string
        }
        Update: {
          created_at?: string
          metadata?: Json
          version?: string
        }
        Relationships: []
      }
      gpus: {
        Row: {
          name: string
          watt: number
        }
        Insert: {
          name: string
          watt: number
        }
        Update: {
          name?: string
          watt?: number
        }
        Relationships: []
      }
      model_versions: {
        Row: {
          created_at: string
          metadata: Json
          method: string
          version: string
        }
        Insert: {
          created_at?: string
          metadata: Json
          method: string
          version: string
        }
        Update: {
          created_at?: string
          metadata?: Json
          method?: string
          version?: string
        }
        Relationships: []
      }
      provider_regions: {
        Row: {
          country: string
          impact: number
          offset_ratio: number
          provider_name: string
          region_name: string
          source: string
        }
        Insert: {
          country?: string
          impact: number
          offset_ratio?: number
          provider_name: string
          region_name: string
          source?: string
        }
        Update: {
          country?: string
          impact?: number
          offset_ratio?: number
          provider_name?: string
          region_name?: string
          source?: string
        }
        Relationships: [
          {
            foreignKeyName: "provider_regions_provider_name_fkey"
            columns: ["provider_name"]
            isOneToOne: false
            referencedRelation: "providers"
            referencedColumns: ["name"]
          },
        ]
      }
      providers: {
        Row: {
          name: string
          provider_name: string
        }
        Insert: {
          name: string
          provider_name: string
        }
        Update: {
          name?: string
          provider_name?: string
        }
        Relationships: []
      }
      recommendation_completions: {
        Row: {
          completed_at: string
          recommendation_id: string
          user_id: string
        }
        Insert: {
          completed_at?: string
          recommendation_id: string
          user_id?: string
        }
        Update: {
          completed_at?: string
          recommendation_id?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "recommendation_completions_recommendation_id_fkey"
            columns: ["recommendation_id"]
            isOneToOne: false
            referencedRelation: "recommendations"
            referencedColumns: ["id"]
          },
        ]
      }
      recommendations: {
        Row: {
          category: string
          description: string
          difficulty: string
          id: string
          impact: string
          impact_value: number
          title: string
          trees_earned: number
        }
        Insert: {
          category: string
          description: string
          difficulty: string
          id?: string
          impact: string
          impact_value: number
          title: string
          trees_earned: number
        }
        Update: {
          category?: string
          description?: string
          difficulty?: string
          id?: string
          impact?: string
          impact_value?: number
          title?: string
          trees_earned?: number
        }
        Relationships: []
      }
      resources: {
        Row: {
          content: Json
          created_at: string
          id: string
          slug: string
          title: string
          type: string
        }
        Insert: {
          content?: Json
          created_at?: string
          id?: string
          slug: string
          title: string
          type: string
        }
        Update: {
          content?: Json
          created_at?: string
          id?: string
          slug?: string
          title?: string
          type?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends (DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never) = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends (DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never) = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends (PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never) = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

