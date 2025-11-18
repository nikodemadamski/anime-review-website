'use client';

import { useEffect, useState } from 'react';
import { Container, Typography, Badge } from '@/components/ui';
import { Breadcrumb } from '@/components/ui/Breadcrumb';
import { useWatchlist } from '@/hooks/useWatchlist';
import { StreamingLinks } from '@/components/monetization/StreamingLinks';
import { SimilarAnime } from '@/components/anime/SimilarAnime';
import Image from 'next/image';
import Link from 'next/link';
import { useParams, useSearchParams } from 'next/navigation';

export const dynamic = 'force-dynamic';

export default function AnimeDetailPage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const [anime, setAnime] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAllReviews, setShowAllReviews] = useState(false);
  const [expandedReviews, setExpandedReviews] = useState<Set<number>>(new Set());
  const [showMoreInfo, setShowMoreInfo] = useState(false);
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [reviewSort, setReviewSort] = useState<'recent' | 'highest' | 'helpful'>('recent');
  const { toggleAnime, isInWatchlist} = useWatchlist();
  
  // Get referrer from URL params for breadcrumb
  const from = searchParams.get('from') || 'browse';

  useEffect(() => {
    async function fetchAnime() {
      try {
        const response = await fetch(`/api/anime/${params.id}`);
        const data = await response.json();
        if (data.success) {
          setAnime(data.data);
          
          // Update meta tags dynamically
          if (typeof window !== 'undefined') {
            document.title = `${data.data.title} - Anime Review`;
            
            // Update or create meta tags
            updateMetaTag('og:title', `${data.data.title} - Rated ${data.data.ratings.site.toFixed(1)}/10`);
            updateMetaTag('og:description', data.data.description || `Check out ${data.data.title} with ratings across 4 categories!`);
            updateMetaTag('og:image', data.data.coverImage);
            updateMetaTag('og:url', window.location.href);
            updateMetaTag('og:type', 'website');
            
            // Twitter Card
            updateMetaTag('twitter:card', 'summary_large_image');
            updateMetaTag('twitter:title', `${data.data.title} - Rated ${data.data.ratings.site.toFixed(1)}/10`);
            updateMetaTag('twitter:description', data.data.description || `Check out ${data.data.title} with ratings across 4 categories!`);
            updateMetaTag('twitter:image', data.data.coverImage);
          }
        }
      } catch (error) {
        console.error('Error fetching anime:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchAnime();
  }, [params.id]);

  // Helper function to update meta tags
  const updateMetaTag = (property: string, content: string) => {
    if (typeof window === 'undefined') return;
    
    const isOg = property.startsWith('og:');
    const isTwitter = property.startsWith('twitter:');
    const attr = isOg || isTwitter ? 'property' : 'name';
    
    let meta = document.querySelector(`meta[${attr}="${property}"]`);
    
    if (!meta) {
      meta = document.createElement('meta');
      meta.setAttribute(attr, property);
      document.head.appendChild(meta);
    }
    
    meta.setAttribute('content', content);
  };

  const toggleReview = (index: number) => {
    const newExpanded = new Set(expandedReviews);
    if (newExpanded.has(index)) {
      newExpanded.delete(index);
    } else {
      newExpanded.add(index);
    }
    setExpandedReviews(newExpanded);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-6xl animate-bounce">🍿</div>
        <div 
          className="animate-spin rounded-full h-12 w-12 border-4"
          style={{ 
            borderColor: 'var(--border)',
            borderTopColor: 'var(--btn-primary)'
          }}
        ></div>
        <p className="text-lg font-semibold animate-pulse" style={{ color: 'var(--secondary)' }}>
          Loading anime magic... ✨
        </p>
      </div>
    );
  }

  if (!anime) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-4" style={{ backgroundColor: 'var(--background)' }}>
        <div className="text-8xl">😢</div>
        <Typography variant="h2" style={{ color: 'var(--foreground)' }}>Anime not found</Typography>
        <p style={{ color: 'var(--secondary)' }}>This anime seems to have disappeared into another dimension...</p>
        <Link
          href="/browse"
          className="mt-4 px-6 py-3 rounded-xl font-bold transition-all hover:scale-105"
          style={{
            backgroundColor: 'var(--btn-primary)',
            color: 'var(--btn-primary-text)'
          }}
        >
          Browse Other Anime
        </Link>
      </div>
    );
  }

  const reviews = anime.reviews || [];
  
  // Sort reviews based on selected option
  const sortedReviews = [...reviews].sort((a, b) => {
    if (reviewSort === 'highest') {
      return b.score - a.score;
    } else if (reviewSort === 'helpful') {
      // For now, use score as proxy for helpful (can be enhanced later)
      return b.score - a.score;
    }
    // Default: recent (keep original order)
    return 0;
  });
  
  const displayedReviews = showAllReviews ? sortedReviews.slice(0, 10) : sortedReviews.slice(0, 5);

  // Build breadcrumb items
  const breadcrumbItems = [
    { label: 'Home', href: '/' },
    { label: from === 'trending' ? 'Trending' : 'Browse', href: from === 'trending' ? '/#trending' : '/browse' },
    { label: anime?.title || 'Loading...' },
  ];

  return (
    <div className="py-6" style={{ backgroundColor: 'var(--background)' }}>
      <Container>
        {/* Breadcrumb Navigation */}
        <Breadcrumb items={breadcrumbItems} />

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Cover Image - Smaller on desktop, hidden on mobile */}
          <div className="lg:col-span-1 hidden lg:block">
            <div className="rounded-2xl overflow-hidden shadow-lg sticky top-20 border" style={{ borderColor: 'var(--border)' }}>
              <div className="aspect-[3/4] relative" style={{ backgroundColor: 'var(--card-background)' }}>
                <Image
                  src={anime.coverImage}
                  alt={anime.title}
                  fill
                  className="object-cover"
                  priority
                  sizes="25vw"
                />
              </div>
            </div>
          </div>

          {/* Main Content - More space */}
          <div className="lg:col-span-3 space-y-6">
            {/* Title & Key Info */}
            <div>
              <div className="flex items-start justify-between gap-4 mb-3">
                <h1 className="text-3xl md:text-4xl font-bold flex-1" style={{ color: 'var(--foreground)' }}>
                  {anime.title}
                </h1>
                
                {/* Action Buttons */}
                <div className="flex gap-2">
                  {/* Watchlist Button */}
                  <button
                    onClick={() => toggleAnime(anime.id)}
                    className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
                    style={{
                      backgroundColor: isInWatchlist(anime.id) ? '#FF6B9D' : 'var(--card-background)',
                      borderWidth: '2px',
                      borderColor: isInWatchlist(anime.id) ? '#FF6B9D' : 'var(--border)',
                      color: isInWatchlist(anime.id) ? '#FFFFFF' : 'var(--foreground)'
                    }}
                    title={isInWatchlist(anime.id) ? 'Remove from watchlist' : 'Add to watchlist'}
                  >
                    <svg 
                      className="w-5 h-5" 
                      fill={isInWatchlist(anime.id) ? 'currentColor' : 'none'} 
                      stroke="currentColor" 
                      viewBox="0 0 24 24"
                      strokeWidth={2}
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </button>

                  {/* Share Button with Dropdown */}
                  <div className="relative">
                    <button
                      onClick={() => setShowShareMenu(!showShareMenu)}
                      className="p-2.5 rounded-xl transition-all duration-300 hover:scale-110 shadow-md"
                      style={{
                        backgroundColor: showShareMenu ? 'var(--accent)' : 'var(--card-background)',
                        borderWidth: '2px',
                        borderColor: showShareMenu ? 'var(--accent)' : 'var(--border)',
                        color: showShareMenu ? '#FFFFFF' : 'var(--foreground)'
                      }}
                      title="Share"
                    >
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>

                    {/* Share Menu Dropdown */}
                    {showShareMenu && (
                      <>
                        {/* Backdrop */}
                        <div 
                          className="fixed inset-0 z-10"
                          onClick={() => setShowShareMenu(false)}
                        />
                        
                        {/* Menu */}
                        <div 
                          className="absolute right-0 mt-2 w-56 rounded-xl shadow-2xl border-2 z-20 overflow-hidden animate-fade-in"
                          style={{
                            backgroundColor: 'var(--card-background)',
                            borderColor: 'var(--border)'
                          }}
                        >
                          {/* Twitter */}
                          <button
                            onClick={() => {
                              const text = `Just found ${anime.title} on Anime Review! Rated ${anime.ratings.site.toFixed(1)}/10 🔥`;
                              const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}&url=${encodeURIComponent(window.location.href)}&hashtags=anime,animereview`;
                              window.open(url, '_blank');
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                            style={{ color: 'var(--foreground)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                            </svg>
                            <span className="font-semibold">Share on Twitter</span>
                          </button>

                          {/* Facebook */}
                          <button
                            onClick={() => {
                              const url = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(window.location.href)}`;
                              window.open(url, '_blank');
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                            style={{ color: 'var(--foreground)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                            </svg>
                            <span className="font-semibold">Share on Facebook</span>
                          </button>

                          {/* Copy Link */}
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(window.location.href);
                              alert('Link copied to clipboard! 📋');
                              setShowShareMenu(false);
                            }}
                            className="w-full px-4 py-3 flex items-center gap-3 transition-colors text-left"
                            style={{ color: 'var(--foreground)' }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = 'var(--text-block)'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'transparent'}
                          >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                              <path strokeLinecap="round" strokeLinejoin="round" d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                            </svg>
                            <span className="font-semibold">Copy Link</span>
                          </button>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
              
              {/* Key Badges */}
              <div className="flex flex-wrap gap-2 mb-3">
                {anime.genres && anime.genres.slice(0, 3).map((genre: string) => (
                  <Badge key={genre} variant="default">{genre}</Badge>
                ))}
                {anime.status && <Badge variant="info">{anime.status}</Badge>}
                {anime.episodes && <Badge variant="default">{anime.episodes} eps</Badge>}
              </div>
            </div>

            {/* Ratings - PROMINENT & EMPHASIZED */}
            <div 
              className="rounded-3xl p-6 shadow-lg border-2 animate-fade-in-up"
              style={{
                backgroundColor: 'var(--card-background)',
                borderColor: 'var(--border)'
              }}
            >
              {/* Overall Rating - Large with Fun Copy */}
              <div 
                className="text-center mb-6 pb-6 border-b-2"
                style={{ borderColor: 'var(--border)' }}
              >
                <div 
                  className="text-sm font-semibold uppercase tracking-wide mb-2"
                  style={{ color: 'var(--muted)' }}
                >
                  {anime.ratings.site >= 9 ? '🔥 This Anime Slaps!' : anime.ratings.site >= 8 ? '⭐ Highly Rated' : anime.ratings.site >= 7 ? '👍 Pretty Good' : '📊 Overall Rating'}
                </div>
                <div 
                  className="text-6xl font-black animate-pulse"
                  style={{ color: 'var(--rating-overall)' }}
                >
                  {anime.ratings.site.toFixed(1)}
                </div>
                <div 
                  className="text-lg font-medium"
                  style={{ color: 'var(--secondary)' }}
                >
                  out of 10 ✨
                </div>
                {anime.ratings.site >= 9 && (
                  <div 
                    className="mt-3 px-4 py-2 rounded-full inline-block text-sm font-bold"
                    style={{ 
                      backgroundColor: '#FF6B9D',
                      color: '#FFFFFF'
                    }}
                  >
                    🏆 Must Watch!
                  </div>
                )}
              </div>

              {/* Category Ratings - Large & Prominent with VIBRANT COLORS */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { key: 'visual', label: 'Visual', color: '#FF6B9D', bgLight: '#FFE4EF', icon: 'M15 12a3 3 0 11-6 0 3 3 0 016 0z M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z' },
                  { key: 'music', label: 'Music', color: '#9D4EDD', bgLight: '#F3E8FF', icon: 'M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3' },
                  { key: 'story', label: 'Story', color: '#06B6D4', bgLight: '#CFFAFE', icon: 'M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253' },
                  { key: 'character', label: 'Character', color: '#F59E0B', bgLight: '#FEF3C7', icon: 'M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z' },
                ].map(({ key, label, color, bgLight, icon }, index) => (
                  <div 
                    key={key} 
                    className="text-center p-4 rounded-2xl shadow-md hover:shadow-2xl transition-all duration-300 hover:scale-110 hover:-translate-y-1 border cursor-pointer group"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)',
                      animationDelay: `${index * 100}ms`
                    }}
                  >
                    {/* Icon with Glow Effect */}
                    <div 
                      className="w-14 h-14 mx-auto mb-3 rounded-xl flex items-center justify-center shadow-lg group-hover:shadow-2xl transition-all duration-300 group-hover:scale-110" 
                      style={{ backgroundColor: color }}
                    >
                      <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                        <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
                      </svg>
                    </div>
                    {/* Rating with Emoji */}
                    <div className="text-3xl font-black mb-1 group-hover:scale-110 transition-transform" style={{ color }}>
                      {anime.ratings[key].toFixed(1)}
                      {anime.ratings[key] >= 9 && ' 🔥'}
                      {anime.ratings[key] >= 8 && anime.ratings[key] < 9 && ' ⭐'}
                    </div>
                    {/* Label */}
                    <div 
                      className="text-sm font-semibold mb-2"
                      style={{ color: 'var(--secondary)' }}
                    >
                      {label}
                    </div>
                    {/* Animated Progress Bar */}
                    <div 
                      className="w-full rounded-full h-2.5 overflow-hidden"
                      style={{ backgroundColor: 'var(--border)' }}
                    >
                      <div 
                        className="h-2.5 rounded-full transition-all duration-1000 ease-out"
                        style={{ 
                          width: `${(anime.ratings[key] / 10) * 100}%`,
                          backgroundColor: color,
                          boxShadow: `0 0 10px ${color}40`
                        }}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Synopsis - More Readable with Personality */}
            {anime.description && (
              <div 
                className="rounded-2xl p-6 border-2 hover:border-accent transition-colors"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: 'var(--border)'
                }}
              >
                <h3 className="font-bold text-xl mb-3 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                  <span>📖</span>
                  <span>What's it about?</span>
                </h3>
                <p className="text-base leading-relaxed" style={{ color: 'var(--secondary)' }}>{anime.description}</p>
              </div>
            )}

            {/* Perfect For Section - NEW! */}
            <div 
              className="rounded-2xl p-6 border-2"
              style={{
                background: 'linear-gradient(135deg, var(--card-background) 0%, var(--text-block) 100%)',
                borderColor: 'var(--border)'
              }}
            >
              <h3 className="font-bold text-xl mb-4 flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                <span>✨</span>
                <span>Perfect for you if you love...</span>
              </h3>
              <div className="flex flex-wrap gap-2">
                {anime.genres && anime.genres.map((genre: string) => (
                  <span 
                    key={genre}
                    className="px-4 py-2 rounded-full font-semibold text-sm transition-all hover:scale-105 cursor-default"
                    style={{
                      backgroundColor: 'var(--accent)',
                      color: '#FFFFFF'
                    }}
                  >
                    {genre}
                  </span>
                ))}
              </div>
            </div>

            {/* Where to Watch - With Affiliate Links */}
            <StreamingLinks animeId={anime.id} animeTitle={anime.title} />

            {/* More Info - Collapsible */}
            {(anime.studios?.length > 0 || anime.source || anime.themes?.length > 0) && (
              <div>
                <button
                  onClick={() => setShowMoreInfo(!showMoreInfo)}
                  className="w-full flex items-center justify-between p-4 rounded-xl transition-colors"
                  style={{
                    backgroundColor: 'var(--card-background)',
                    color: 'var(--foreground)'
                  }}
                >
                  <span className="font-semibold">More Information</span>
                  <svg 
                    className={`w-5 h-5 transition-transform ${showMoreInfo ? 'rotate-180' : ''}`} 
                    fill="none" 
                    stroke="currentColor" 
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </button>
                {showMoreInfo && (
                  <div 
                    className="mt-2 p-4 rounded-xl border"
                    style={{
                      backgroundColor: 'var(--background)',
                      borderColor: 'var(--border)'
                    }}
                  >
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      {anime.source && (
                        <div>
                          <span style={{ color: 'var(--muted)' }}>Source:</span>
                          <p className="font-medium" style={{ color: 'var(--foreground)' }}>{anime.source}</p>
                        </div>
                      )}
                      {anime.studios && anime.studios.length > 0 && (
                        <div>
                          <span style={{ color: 'var(--muted)' }}>Studio:</span>
                          <p className="font-medium" style={{ color: 'var(--foreground)' }}>{anime.studios.join(', ')}</p>
                        </div>
                      )}
                      {anime.duration && (
                        <div>
                          <span style={{ color: 'var(--muted)' }}>Duration:</span>
                          <p className="font-medium" style={{ color: 'var(--foreground)' }}>{anime.duration}</p>
                        </div>
                      )}
                      {anime.season && (
                        <div>
                          <span style={{ color: 'var(--muted)' }}>Season:</span>
                          <p className="font-medium" style={{ color: 'var(--foreground)' }}>{anime.season} {anime.releaseYear}</p>
                        </div>
                      )}
                    </div>
                    {anime.themes && anime.themes.length > 0 && (
                      <div className="mt-3">
                        <span className="text-sm" style={{ color: 'var(--muted)' }}>Themes:</span>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {anime.themes.map((theme: string) => (
                            <Badge key={theme} variant="info" size="sm">{theme}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}

            {/* Reviews - Limited & Clear with Personality */}
            {reviews.length > 0 && (
              <div 
                className="rounded-2xl p-6 border-2"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: 'var(--border)'
                }}
              >
                <div className="flex items-center justify-between mb-4 flex-wrap gap-3">
                  <h3 className="font-bold text-xl flex items-center gap-2" style={{ color: 'var(--foreground)' }}>
                    <span>💬</span>
                    <span>What fans are saying</span>
                  </h3>
                  <div className="flex items-center gap-3">
                    {/* Sort Dropdown */}
                    <select
                      value={reviewSort}
                      onChange={(e) => setReviewSort(e.target.value as any)}
                      className="px-3 py-1.5 rounded-lg text-sm font-semibold border-2 transition-all"
                      style={{
                        backgroundColor: 'var(--background)',
                        borderColor: 'var(--border)',
                        color: 'var(--foreground)'
                      }}
                    >
                      <option value="recent">Most Recent</option>
                      <option value="highest">Highest Rated</option>
                      <option value="helpful">Most Helpful</option>
                    </select>
                    
                    <span 
                      className="text-sm font-semibold px-3 py-1.5 rounded-full whitespace-nowrap"
                      style={{ 
                        backgroundColor: '#FF6B9D',
                        color: '#FFFFFF'
                      }}
                    >
                      {reviews.length} reviews
                    </span>
                  </div>
                </div>
                <div className="space-y-3">
                  {displayedReviews.map((review: any, index: number) => {
                    const isExpanded = expandedReviews.has(index);
                    const shouldTruncate = review.content.length > 150;
                    
                    return (
                      <div 
                        key={index}
                        className="p-3 rounded-lg"
                        style={{ backgroundColor: 'var(--background)' }}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <div 
                              className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-xs"
                              style={{ backgroundColor: 'var(--btn-primary)' }}
                            >
                              {review.username.charAt(0).toUpperCase()}
                            </div>
                            <span className="font-medium text-sm" style={{ color: 'var(--foreground)' }}>{review.username}</span>
                          </div>
                          <Badge variant="info" size="sm">{review.score.toFixed(1)}</Badge>
                        </div>
                        <p className="text-sm" style={{ color: 'var(--secondary)' }}>
                          {isExpanded || !shouldTruncate 
                            ? review.content 
                            : `${review.content.substring(0, 150)}...`}
                        </p>
                        {shouldTruncate && (
                          <button
                            onClick={() => toggleReview(index)}
                            className="text-xs hover:underline mt-1"
                            style={{ color: 'var(--accent)' }}
                          >
                            {isExpanded ? 'Show less' : 'Read more'}
                          </button>
                        )}
                      </div>
                    );
                  })}
                </div>
                
                {reviews.length > 5 && !showAllReviews && (
                  <button
                    onClick={() => setShowAllReviews(true)}
                    className="mt-4 w-full py-3 rounded-xl transition-all duration-300 hover:scale-105 text-sm font-bold shadow-md"
                    style={{
                      backgroundColor: 'var(--btn-primary)',
                      color: 'var(--btn-primary-text)'
                    }}
                  >
                    Load More Reviews ({Math.min(reviews.length - 5, 5)} more)
                  </button>
                )}
                {showAllReviews && reviews.length > 10 && (
                  <p className="mt-3 text-center text-sm" style={{ color: 'var(--muted)' }}>
                    Showing 10 of {reviews.length} reviews
                  </p>
                )}
              </div>
            )}

            {/* Similar Anime Section */}
            {anime && (
              <div 
                className="rounded-2xl p-6 border-2"
                style={{
                  backgroundColor: 'var(--card-background)',
                  borderColor: 'var(--border)'
                }}
              >
                <SimilarAnime currentAnime={anime} />
              </div>
            )}

            {/* Update Notice - Minimal */}
            <div 
              className="text-center py-4 text-xs"
              style={{ color: 'var(--muted)' }}
            >
              Data current as of Fall 2025
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
}
