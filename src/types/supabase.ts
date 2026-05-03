export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          instagram_handle: string | null;
          avatar_url: string | null;
          plan_id: string | null;
          full_name: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id: string;
          instagram_handle?: string | null;
          avatar_url?: string | null;
          plan_id?: string | null;
          full_name?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          instagram_handle?: string | null;
          avatar_url?: string | null;
          plan_id?: string | null;
          full_name?: string | null;
          updated_at?: string;
        };
      };
      plans: {
        Row: {
          id: string;
          name: string;
          slug: string;
          price_brl: number;
          price_id_stripe: string | null;
          features: Json;
          is_highlighted: boolean;
          is_active: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          price_brl: number;
          price_id_stripe?: string | null;
          features?: Json;
          is_highlighted?: boolean;
          is_active?: boolean;
          created_at?: string;
        };
        Update: {
          name?: string;
          slug?: string;
          price_brl?: number;
          price_id_stripe?: string | null;
          features?: Json;
          is_highlighted?: boolean;
          is_active?: boolean;
        };
      };
      subscriptions: {
        Row: {
          id: string;
          user_id: string;
          plan_id: string;
          stripe_subscription_id: string | null;
          stripe_customer_id: string | null;
          status: string;
          current_period_start: string | null;
          current_period_end: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          plan_id: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
          created_at?: string;
        };
        Update: {
          plan_id?: string;
          stripe_subscription_id?: string | null;
          stripe_customer_id?: string | null;
          status?: string;
          current_period_start?: string | null;
          current_period_end?: string | null;
        };
      };
      feedback: {
        Row: {
          id: string;
          user_id: string;
          rating: number;
          category: string;
          message: string;
          admin_reply: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          rating: number;
          category: string;
          message: string;
          admin_reply?: string | null;
          created_at?: string;
        };
        Update: {
          rating?: number;
          category?: string;
          message?: string;
          admin_reply?: string | null;
        };
      };
      notifications: {
        Row: {
          id: string;
          title: string;
          message: string;
          target_type: string;
          target_value: string | null;
          sent_at: string;
          created_by: string;
        };
        Insert: {
          id?: string;
          title: string;
          message: string;
          target_type: string;
          target_value?: string | null;
          sent_at?: string;
          created_by: string;
        };
        Update: {
          title?: string;
          message?: string;
        };
      };
      user_notifications: {
        Row: {
          id: string;
          user_id: string;
          notification_id: string;
          read_at: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          notification_id: string;
          read_at?: string | null;
          created_at?: string;
        };
        Update: {
          read_at?: string | null;
        };
      };
    };
  };
}

export type Profile = Database["public"]["Tables"]["profiles"]["Row"];
export type Plan = Database["public"]["Tables"]["plans"]["Row"];
export type Subscription = Database["public"]["Tables"]["subscriptions"]["Row"];
export type Feedback = Database["public"]["Tables"]["feedback"]["Row"];
export type Notification = Database["public"]["Tables"]["notifications"]["Row"];
