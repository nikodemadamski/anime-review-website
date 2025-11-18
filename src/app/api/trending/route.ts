import { NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import Papa from 'papaparse';

export const dynamic = 'force-static';
export const revalidate = 3600; // Revalidate every hour

export async function GET() {
  try {
    const csvPath = path.join(process.cwd(), 'src', 'data', 'trending-now.csv');
    
    // Check if trending file exists
    if (!fs.existsSync(csvPath)) {
      return NextResponse.json({ data: [] });
    }

    const csvText = fs.readFileSync(csvPath, 'utf-8');
    
    const result = Papa.parse(csvText, {
      header: true,
      skipEmptyLines: true,
      dynamicTyping: true,
    });

    const anime = result.data.map((row: any) => ({
      id: String(row.id),
      title: row.title,
      coverImage: row.coverImage,
      ratings: {
        site: parseFloat(row.site) || 0,
        visual: parseFloat(row.visual) || 0,
        music: parseFloat(row.music) || 0,
        story: parseFloat(row.story) || 0,
        character: parseFloat(row.character) || 0,
      },
      description: row.description || '',
      releaseYear: parseInt(row.releaseYear) || new Date().getFullYear(),
      genres: row.genres ? row.genres.split(',').map((g: string) => g.trim()) : [],
      themes: row.themes ? row.themes.split(',').map((t: string) => t.trim()) : [],
      demographics: row.demographics ? row.demographics.split(',').map((d: string) => d.trim()) : [],
      status: row.status || 'Currently Airing',
      duration: row.duration,
      episodes: parseInt(row.episodes) || 0,
      season: row.season,
      studios: row.studios ? row.studios.split(',').map((s: string) => s.trim()) : [],
      source: row.source,
      rank: parseInt(row.rank) || 0,
      popularity: parseInt(row.popularity) || 0,
      members: parseInt(row.members) || 0,
      reviews: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }));

    return NextResponse.json({ data: anime });
  } catch (error) {
    console.error('Error loading trending anime:', error);
    return NextResponse.json({ data: [] });
  }
}
