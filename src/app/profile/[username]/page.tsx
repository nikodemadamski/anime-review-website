import { notFound } from 'next/navigation';
import { supabase } from '@/lib/supabase/client';
import { Container } from '@/components/ui';
import { ProfileHeader } from '@/components/profile/ProfileHeader';
import { ProfileStats } from '@/components/profile/ProfileStats';
import { Metadata } from 'next';
import { ProfileTabs } from '@/components/profile/ProfileTabs';

interface PageProps {
    params: Promise<{ username: string }>;
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
    const { username } = await params;

    // Clean username (remove %40 if present for @)
    const cleanUsername = decodeURIComponent(username).replace('@', '');

    return {
        title: `${cleanUsername}'s Profile | Anime Review Website`,
        description: `Check out ${cleanUsername}'s anime watchlist and reviews.`,
    };
}

// Fetch helper
async function getProfileData(username: string) {
    // 1. Get Profile
    const { data: profile } = await supabase
        .from('profiles')
        .select('*')
        .ilike('username', username) // Case insensitive lookup
        .single();

    if (!profile) return null;

    // 2. Get Stats
    // Watchlist Count
    const { count: watchlistCount } = await supabase
        .from('watchlists')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', profile.id);

    // Reviews with Anime Data
    const { data: reviews } = await supabase
        .from('reviews')
        .select(`
            *,
            anime:anime_id(id, title, cover_image)
        `)
        .eq('user_id', profile.id)
        .order('created_at', { ascending: false });

    const totalReviews = reviews?.length || 0;
    const averageScore = totalReviews > 0
        ? reviews!.reduce((acc, curr) => acc + (curr.rating || 0), 0) / totalReviews
        : 0;

    // Format reviews to match type
    const formattedReviews = (reviews || []).map((review: any) => ({
        ...review,
        anime: review.anime // Supabase join result
    }));

    return {
        profile,
        reviews: formattedReviews,
        stats: {
            animeWatched: watchlistCount || 0,
            totalReviews: totalReviews,
            averageScore: averageScore
        }
    };
}

export default async function ProfilePage({ params }: PageProps) {
    const { username } = await params;
    const cleanUsername = decodeURIComponent(username).replace('@', '');

    const data = await getProfileData(cleanUsername);

    if (!data) {
        notFound();
    }

    // TODO: Check if current user is owner
    const isOwnProfile = false;

    return (
        <div className="min-h-screen bg-background pb-20">
            <ProfileHeader profile={data.profile} isOwnProfile={isOwnProfile} />

            <Container>
                <div className="max-w-7xl mx-auto">
                    <ProfileStats stats={data.stats} />

                    <ProfileTabs
                        userId={data.profile.id}
                        initialReviews={data.reviews}
                        watchlistCount={data.stats.animeWatched}
                    />
                </div>
            </Container>
        </div>
    );
}
