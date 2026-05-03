export * from "./supabase";
export * from "./stripe";

export interface ContentIdea {
  id: string;
  title: string;
  description: string;
  format: "Reels" | "Stories" | "Post";
  difficulty: "easy" | "medium" | "hard";
  category: string;
  saved?: boolean;
}

export interface HashtagResult {
  tag: string;
  audienceSize: string;
  relevance: number;
  type: "mega" | "large" | "medium" | "small" | "micro";
}

export interface ProfileScore {
  total: number;
  breakdown: {
    bio: number;
    consistency: number;
    hashtags: number;
    engagement: number;
    content: number;
    visuals: number;
  };
  suggestions: string[];
}

export interface DashboardMetrics {
  followers: number;
  followersGrowth: number;
  engagement: number;
  engagementGrowth: number;
  posts: number;
  postsGrowth: number;
  score: number;
  scoreGrowth: number;
}

export interface Competitor {
  id: string;
  handle: string;
  name: string;
  followers: number;
  engagement: number;
  score: number;
  postsPerWeek: number;
  topFormat: string;
}

export interface AdminStats {
  totalUsers: number;
  totalUsersGrowth: number;
  mrr: number;
  mrrGrowth: number;
  churn: number;
  churnGrowth: number;
  conversion: number;
  conversionGrowth: number;
}

export interface UserWithProfile {
  id: string;
  email: string;
  full_name: string | null;
  instagram_handle: string | null;
  plan_name: string | null;
  status: "active" | "suspended" | "trialing";
  created_at: string;
}
