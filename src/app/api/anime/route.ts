import { NextResponse } from 'next/server';
import { GitHubDataAccess } from '@/lib/github-data-access';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get('q');
    const limit = searchParams.get('limit');
    const sortBy = searchParams.get('sortBy') as 'site' | 'visual' | 'music' | 'story' | 'character' || 'site';

    let anime;

    if (query) {
      // Search anime
      anime = await GitHubDataAccess.searchAnime(query);
    } else if (limit) {
      // Get top rated with sorting
      anime = await GitHubDataAccess.getTopRated(parseInt(limit), sortBy);
    } else {
      // Get all anime sorted
      anime = await GitHubDataAccess.getAllAnimeSorted(sortBy);
    }

    return NextResponse.json({
      success: true,
      data: anime,
      count: anime.length,
    });
  } catch (error) {
    console.error('Error fetching anime:', error);
    return NextResponse.json(
      {
        success: false,
        error: 'Failed to fetch anime data',
      },
      { status: 500 }
    );
  }
}

export const dynamic = 'force-dynamic';