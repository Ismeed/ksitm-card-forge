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
    PostgrestVersion: "14.5"
  }
  public: {
    Tables: {
      applications: {
        Row: {
          application_type: Database["public"]["Enums"]["application_type"]
          appointment_date: string | null
          college: string | null
          current_level: string | null
          date_of_birth: string
          department: string | null
          designation: string | null
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          employment_type: string | null
          first_name: string
          gender: string
          id: string
          last_name: string
          matric_number: string | null
          middle_name: string | null
          phone: string
          photo_url: string | null
          programme: string | null
          programme_level: Database["public"]["Enums"]["programme_level"] | null
          reference_number: string
          reviewed_at: string | null
          reviewed_by: string | null
          reviewer_note: string | null
          session: string | null
          signature_url: string | null
          staff_id: string | null
          state_of_origin: string
          status: Database["public"]["Enums"]["application_status"]
          student_type: Database["public"]["Enums"]["student_mode"] | null
          submitted_at: string
          unit: string | null
          year_of_admission: number | null
        }
        Insert: {
          application_type: Database["public"]["Enums"]["application_type"]
          appointment_date?: string | null
          college?: string | null
          current_level?: string | null
          date_of_birth: string
          department?: string | null
          designation?: string | null
          email: string
          emergency_contact_name: string
          emergency_contact_phone: string
          emergency_contact_relationship: string
          employment_type?: string | null
          first_name: string
          gender: string
          id?: string
          last_name: string
          matric_number?: string | null
          middle_name?: string | null
          phone: string
          photo_url?: string | null
          programme?: string | null
          programme_level?:
            | Database["public"]["Enums"]["programme_level"]
            | null
          reference_number?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_note?: string | null
          session?: string | null
          signature_url?: string | null
          staff_id?: string | null
          state_of_origin: string
          status?: Database["public"]["Enums"]["application_status"]
          student_type?: Database["public"]["Enums"]["student_mode"] | null
          submitted_at?: string
          unit?: string | null
          year_of_admission?: number | null
        }
        Update: {
          application_type?: Database["public"]["Enums"]["application_type"]
          appointment_date?: string | null
          college?: string | null
          current_level?: string | null
          date_of_birth?: string
          department?: string | null
          designation?: string | null
          email?: string
          emergency_contact_name?: string
          emergency_contact_phone?: string
          emergency_contact_relationship?: string
          employment_type?: string | null
          first_name?: string
          gender?: string
          id?: string
          last_name?: string
          matric_number?: string | null
          middle_name?: string | null
          phone?: string
          photo_url?: string | null
          programme?: string | null
          programme_level?:
            | Database["public"]["Enums"]["programme_level"]
            | null
          reference_number?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          reviewer_note?: string | null
          session?: string | null
          signature_url?: string | null
          staff_id?: string | null
          state_of_origin?: string
          status?: Database["public"]["Enums"]["application_status"]
          student_type?: Database["public"]["Enums"]["student_mode"] | null
          submitted_at?: string
          unit?: string | null
          year_of_admission?: number | null
        }
        Relationships: []
      }
      user_roles: {
        Row: {
          created_at: string
          id: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Insert: {
          created_at?: string
          id?: string
          role: Database["public"]["Enums"]["app_role"]
          user_id: string
        }
        Update: {
          created_at?: string
          id?: string
          role?: Database["public"]["Enums"]["app_role"]
          user_id?: string
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      bootstrap_first_admin: { Args: never; Returns: boolean }
      check_application_status: {
        Args: { _ref: string }
        Returns: {
          application_type: Database["public"]["Enums"]["application_type"]
          first_name: string
          last_name: string
          reference_number: string
          reviewer_note: string
          status: Database["public"]["Enums"]["application_status"]
          submitted_at: string
        }[]
      }
      generate_reference_number: { Args: never; Returns: string }
      has_role: {
        Args: {
          _role: Database["public"]["Enums"]["app_role"]
          _user_id: string
        }
        Returns: boolean
      }
      submit_application: { Args: { payload: Json }; Returns: string }
    }
    Enums: {
      app_role: "security_unit"
      application_status: "pending" | "approved" | "rejected"
      application_type: "student" | "staff"
      programme_level: "ND" | "HND"
      student_mode: "full_time" | "part_time"
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
    Enums: {
      app_role: ["security_unit"],
      application_status: ["pending", "approved", "rejected"],
      application_type: ["student", "staff"],
      programme_level: ["ND", "HND"],
      student_mode: ["full_time", "part_time"],
    },
  },
} as const
