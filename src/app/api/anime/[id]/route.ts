import { NextResponse } from 'next/server';
import { GitHubDataAccess } from '@/lib/github-data-access';

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const anime = await GitHubDataAccess.getAnimeById(id);

    if (!anime) {
      return NextResponse.json(
        {
          success: false,
          error: 'Anime not found',
        },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: anime,
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