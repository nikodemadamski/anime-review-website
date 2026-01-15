export interface Review {
  id: string;
  user_id: string;
  anime_id: string;
  content: string | null;
  rating: number; // 1-10
  likes_count: number;
  created_at: string;
  user?: {
    full_name: string | null;
    avatar_url: string | null;
  };
  anime?: {
    id: string;
    title: string;
    cover_image: string;
  };
}