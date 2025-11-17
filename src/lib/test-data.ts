// Simple test file to verify data access works
import { DataAccess } from './data-access';

export async function testDataAccess() {
  try {
    console.log('Testing data access...');
    
    // Test anime data
    const anime = await DataAccess.getAllAnime();
    console.log(`Loaded ${anime.length} anime entries`);
    
    if (anime.length > 0) {
      const firstAnime = anime[0];
      console.log(`First anime: ${firstAnime.title}`);
      
      // Test reviews for first anime
      const reviews = await DataAccess.getReviewsByAnimeId(firstAnime.id);
      console.log(`Found ${reviews.length} reviews for ${firstAnime.title}`);
      
      // Test aggregated reviews
      const aggregated = await DataAccess.getAggregatedReviews(firstAnime.id);
      if (aggregated) {
        console.log(`Average ratings - Visual: ${aggregated.averageRatings.visual}, Music: ${aggregated.averageRatings.music}, Cute: ${aggregated.averageRatings.cute}`);
      }
      
      // Test streaming links
      const streamingLinks = await DataAccess.getStreamingLinksByAnimeId(firstAnime.id);
      console.log(`Found ${streamingLinks.length} streaming links for ${firstAnime.title}`);
    }
    
    return true;
  } catch (error) {
    console.error('Data access test failed:', error);
    return false;
  }
}