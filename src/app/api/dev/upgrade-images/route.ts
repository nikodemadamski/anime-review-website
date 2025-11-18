import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import Papa from 'papaparse';

export async function POST() {
  try {
    const CSV_FILE_PATH = path.join(process.cwd(), 'src', 'data', 'anime-2025.csv');
    
    // Read the CSV file
    const csvText = await fs.readFile(CSV_FILE_PATH, 'utf-8');
    
    // Parse CSV
    const parsed = await new Promise<Papa.ParseResult<any>>((resolve) => {
      Papa.parse(csvText, {
        header: true,
        skipEmptyLines: true,
        complete: resolve,
      });
    });
    
    let updatedCount = 0;
    
    // Upgrade image URLs
    const updatedData = parsed.data.map((row: any) => {
      if (row.cover_image_url && row.cover_image_url.includes('/medium/')) {
        row.cover_image_url = row.cover_image_url.replace('/medium/', '/large/');
        updatedCount++;
      }
      return row;
    });
    
    // Convert back to CSV
    const newCsv = Papa.unparse(updatedData, {
      header: true,
    });
    
    // Write back to file
    await fs.writeFile(CSV_FILE_PATH, newCsv, 'utf-8');
    
    return NextResponse.json({
      success: true,
      message: `Successfully upgraded ${updatedCount} image URLs to high quality`,
      updatedCount,
      totalAnime: updatedData.length,
    });
  } catch (error) {
    console.error('Error upgrading images:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to upgrade images' },
      { status: 500 }
    );
  }
}
