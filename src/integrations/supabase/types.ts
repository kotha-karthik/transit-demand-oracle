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
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      predictions: {
        Row: {
          confidence_score: number | null
          created_at: string
          id: string
          input_features: Json | null
          model_version: string | null
          predicted_value: number
          prediction_time: string
          prediction_type: string
          station_name: string
        }
        Insert: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_features?: Json | null
          model_version?: string | null
          predicted_value: number
          prediction_time: string
          prediction_type: string
          station_name: string
        }
        Update: {
          confidence_score?: number | null
          created_at?: string
          id?: string
          input_features?: Json | null
          model_version?: string | null
          predicted_value?: number
          prediction_time?: string
          prediction_type?: string
          station_name?: string
        }
        Relationships: []
      }
      underground_data: {
        Row: {
          accessibility_requests: number | null
          anomaly_detected: number | null
          avg_dwell_time: number | null
          congestion_level: string
          contactless_payments: number | null
          created_at: string
          day_of_week: string
          delays_minutes: number | null
          entry_count: number
          exit_count: number
          hour: number
          id: string
          incidents: number | null
          is_rush_hour: number
          line: string
          maintenance_scheduled: number | null
          oyster_payments: number | null
          passenger_count: number
          peak_multiplier: number | null
          platform_crowding: number | null
          predicted_next_hour: number | null
          previous_hour_flow: number | null
          service_status: string
          station_name: string
          temperature: number | null
          ticket_sales: number | null
          timestamp: string
          train_frequency: number | null
          weather_condition: string | null
        }
        Insert: {
          accessibility_requests?: number | null
          anomaly_detected?: number | null
          avg_dwell_time?: number | null
          congestion_level: string
          contactless_payments?: number | null
          created_at?: string
          day_of_week: string
          delays_minutes?: number | null
          entry_count: number
          exit_count: number
          hour: number
          id?: string
          incidents?: number | null
          is_rush_hour: number
          line: string
          maintenance_scheduled?: number | null
          oyster_payments?: number | null
          passenger_count: number
          peak_multiplier?: number | null
          platform_crowding?: number | null
          predicted_next_hour?: number | null
          previous_hour_flow?: number | null
          service_status: string
          station_name: string
          temperature?: number | null
          ticket_sales?: number | null
          timestamp: string
          train_frequency?: number | null
          weather_condition?: string | null
        }
        Update: {
          accessibility_requests?: number | null
          anomaly_detected?: number | null
          avg_dwell_time?: number | null
          congestion_level?: string
          contactless_payments?: number | null
          created_at?: string
          day_of_week?: string
          delays_minutes?: number | null
          entry_count?: number
          exit_count?: number
          hour?: number
          id?: string
          incidents?: number | null
          is_rush_hour?: number
          line?: string
          maintenance_scheduled?: number | null
          oyster_payments?: number | null
          passenger_count?: number
          peak_multiplier?: number | null
          platform_crowding?: number | null
          predicted_next_hour?: number | null
          previous_hour_flow?: number | null
          service_status?: string
          station_name?: string
          temperature?: number | null
          ticket_sales?: number | null
          timestamp?: string
          train_frequency?: number | null
          weather_condition?: string | null
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
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
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
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
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
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
