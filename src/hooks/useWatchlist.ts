import { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase/client';
import { useAuth } from '@/context/AuthContext';

export interface WatchlistItem {
  id: string;
  anime_id: string;
  status: 'plan_to_watch' | 'watching' | 'completed' | 'dropped';
  created_at: string;
}

export function useWatchlist() {
  const { user } = useAuth();
  const [watchlist, setWatchlist] = useState<WatchlistItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch watchlist on mount or user change
  useEffect(() => {
    if (!user) {
      setWatchlist([]);
      setLoading(false);
      return;
    }

    const fetchWatchlist = async () => {
      try {
        const { data, error } = await supabase
          .from('watchlists')
          .select('*')
          .eq('user_id', user.id);

        if (error) throw error;
        setWatchlist(data || []);
      } catch (error) {
        console.error('Error fetching watchlist:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchWatchlist();

    // Subscribe to realtime changes
    const subscription = supabase
      .channel('watchlists_channel')
      .on('postgres_changes', {
        event: '*',
        schema: 'public',
        table: 'watchlists',
        filter: `user_id=eq.${user.id}`
      }, (payload) => {
        fetchWatchlist(); // Reload on any change
      })
      .subscribe();

    return () => {
      subscription.unsubscribe();
    };
  }, [user]);

  const isInWatchlist = (animeId: string) => {
    return watchlist.some(item => item.anime_id === animeId);
  };

  const addToWatchlist = async (animeId: string, status: WatchlistItem['status'] = 'plan_to_watch') => {
    if (!user) {
      alert('Please sign in to add to watchlist!');
      return;
    }

    try {
      // Optimistic update
      const tempId = Math.random().toString();
      const newItem: WatchlistItem = { id: tempId, anime_id: animeId, status, created_at: new Date().toISOString() };
      setWatchlist(prev => [...prev, newItem]);

      const { error } = await supabase
        .from('watchlists')
        .insert({ user_id: user.id, anime_id: animeId, status });

      if (error) throw error;
    } catch (error) {
      console.error('Error adding to watchlist:', error);
      // Revert optimistic update
      setWatchlist(prev => prev.filter(item => item.anime_id !== animeId));
    }
  };

  const removeFromWatchlist = async (animeId: string) => {
    if (!user) return;

    try {
      // Optimistic update
      setWatchlist(prev => prev.filter(item => item.anime_id !== animeId));

      const { error } = await supabase
        .from('watchlists')
        .delete()
        .eq('user_id', user.id)
        .eq('anime_id', animeId);

      if (error) throw error;
    } catch (error) {
      console.error('Error removing from watchlist:', error);
      const { data } = await supabase.from('watchlists').select('*').eq('user_id', user.id);
      setWatchlist(data || []);
    }
  };

  const toggleWatchlist = async (animeId: string) => {
    if (isInWatchlist(animeId)) {
      await removeFromWatchlist(animeId);
    } else {
      await addToWatchlist(animeId);
    }
  };

  return {
    watchlist,
    loading,
    isInWatchlist,
    addToWatchlist,
    removeFromWatchlist,
    toggleWatchlist
  };
}
