export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instanciate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.3 (519615d)"
  }
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      Categories: {
        Row: {
          created_at: string
          id: number
          name: string
          org_id: number
        }
        Insert: {
          created_at?: string
          id?: number
          name: string
          org_id: number
        }
        Update: {
          created_at?: string
          id?: number
          name?: string
          org_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "Categories_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "Organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      Folders: {
        Row: {
          created_at: string
          deleted: boolean
          description: string
          id: number
          last_modified: string
          name: string
          organization_id: number
          parent_id: number | null
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          description?: string
          id?: number
          last_modified?: string
          name?: string
          organization_id: number
          parent_id?: number | null
        }
        Update: {
          created_at?: string
          deleted?: boolean
          description?: string
          id?: number
          last_modified?: string
          name?: string
          organization_id?: number
          parent_id?: number | null
        }
        Relationships: [
          {
            foreignKeyName: "Folders_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "Organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Folders_parent_id_fkey"
            columns: ["parent_id"]
            isOneToOne: false
            referencedRelation: "Folders"
            referencedColumns: ["id"]
          },
        ]
      }
      Items: {
        Row: {
          created_at: string
          deleted: boolean
          description: string
          expiry_date: string | null
          folder_id: number | null
          id: number
          image_file: string
          last_modified: string
          name: string
          org_id: number
          quantity: number
        }
        Insert: {
          created_at?: string
          deleted?: boolean
          description: string
          expiry_date?: string | null
          folder_id?: number | null
          id?: number
          image_file?: string
          last_modified?: string
          name: string
          org_id: number
          quantity: number
        }
        Update: {
          created_at?: string
          deleted?: boolean
          description?: string
          expiry_date?: string | null
          folder_id?: number | null
          id?: number
          image_file?: string
          last_modified?: string
          name?: string
          org_id?: number
          quantity?: number
        }
        Relationships: [
          {
            foreignKeyName: "Items_folder_id_fkey"
            columns: ["folder_id"]
            isOneToOne: false
            referencedRelation: "Folders"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Items_org_id_fkey"
            columns: ["org_id"]
            isOneToOne: false
            referencedRelation: "Organizations"
            referencedColumns: ["id"]
          },
        ]
      }
      items_categories: {
        Row: {
          category_id: number
          created_at: string
          item_id: number
        }
        Insert: {
          category_id: number
          created_at?: string
          item_id: number
        }
        Update: {
          category_id?: number
          created_at?: string
          item_id?: number
        }
        Relationships: [
          {
            foreignKeyName: "items_categories_category_id_fkey"
            columns: ["category_id"]
            isOneToOne: false
            referencedRelation: "Categories"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "items_categories_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "Items"
            referencedColumns: ["id"]
          },
        ]
      }
      Logs: {
        Row: {
          created_at: string
          id: number
          item_id: number
          metadata: Json
          organization_id: number
          performer_id: string
          type: number | null
          typeString: string
        }
        Insert: {
          created_at?: string
          id?: number
          item_id: number
          metadata: Json
          organization_id: number
          performer_id: string
          type?: number | null
          typeString: string
        }
        Update: {
          created_at?: string
          id?: number
          item_id?: number
          metadata?: Json
          organization_id?: number
          performer_id?: string
          type?: number | null
          typeString?: string
        }
        Relationships: [
          {
            foreignKeyName: "Log_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "Organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "Log_performer_id_fkey"
            columns: ["performer_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "Logs_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "Items"
            referencedColumns: ["id"]
          },
        ]
      }
      notifications: {
        Row: {
          created_at: string
          id: number
          notifier: string | null
          organisation: number
          receiver: string
          status: boolean
          type: number
        }
        Insert: {
          created_at: string
          id?: number
          notifier?: string | null
          organisation: number
          receiver: string
          status: boolean
          type: number
        }
        Update: {
          created_at?: string
          id?: number
          notifier?: string | null
          organisation?: number
          receiver?: string
          status?: boolean
          type?: number
        }
        Relationships: [
          {
            foreignKeyName: "notifications_notifier_fkey"
            columns: ["notifier"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          },
          {
            foreignKeyName: "notifications_organisation_fkey"
            columns: ["organisation"]
            isOneToOne: false
            referencedRelation: "Organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "notifications_receiver_fkey"
            columns: ["receiver"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          },
        ]
      }
      Organizations: {
        Row: {
          created_at: string
          id: number
          image_file: string | null
          name: string
        }
        Insert: {
          created_at?: string
          id?: number
          image_file?: string | null
          name: string
        }
        Update: {
          created_at?: string
          id?: number
          image_file?: string | null
          name?: string
        }
        Relationships: []
      }
      Users: {
        Row: {
          accent: string
          base: string
          created_at: string
          email: string
          image_file: string | null
          name: string | null
          theme: string
          user_id: string
        }
        Insert: {
          accent?: string
          base?: string
          created_at?: string
          email: string
          image_file?: string | null
          name?: string | null
          theme?: string
          user_id?: string
        }
        Update: {
          accent?: string
          base?: string
          created_at?: string
          email?: string
          image_file?: string | null
          name?: string | null
          theme?: string
          user_id?: string
        }
        Relationships: []
      }
      users_organizations: {
        Row: {
          created_at: string
          organization_id: number
          role: string
          user_id: string
        }
        Insert: {
          created_at?: string
          organization_id: number
          role: string
          user_id: string
        }
        Update: {
          created_at?: string
          organization_id?: number
          role?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_organizations_organization_id_fkey"
            columns: ["organization_id"]
            isOneToOne: false
            referencedRelation: "Organizations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_organizations_user_id_fkey1"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "Users"
            referencedColumns: ["user_id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      search_books_by_title_prefix: {
        Args: { prefix: string }
        Returns: unknown[]
      }
      search_organizations_by_name_prefix: {
        Args: { prefix: string }
        Returns: unknown[]
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
  graphql_public: {
    Enums: {},
  },
  public: {
    Enums: {},
  },
} as const
