import { MetadataRoute } from 'next';
import { GitHubDataAccess } from '@/lib/github-data-access';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
    const baseUrl = 'https://haki-anime.vercel.app'; // Replace with actual domain if different

    // Static routes
    const routes = [
        '',
        '/browse',
        '/login',
    ].map((route) => ({
        url: `${baseUrl}${route}`,
        lastModified: new Date(),
        changeFrequency: 'daily' as const,
        priority: 1,
    }));

    // Dynamic anime routes
    const allAnime = await GitHubDataAccess.getAllAnime();

    const animeRoutes = allAnime.map((anime) => ({
        url: `${baseUrl}/anime/${anime.id}`,
        lastModified: new Date(anime.updatedAt || new Date()),
        changeFrequency: 'weekly' as const,
        priority: 0.8,
    }));

    return [...routes, ...animeRoutes];
}
