import { ImageResponse } from 'next/og';

export const runtime = 'edge';
export const alt = 'Which Anime Character Are You? - Take the Quiz';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #FF6B9D 0%, #9D4EDD 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '80px',
        }}
      >
        {/* Emoji */}
        <div style={{ fontSize: '200px', marginBottom: '40px' }}>
          🎭
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: '80px',
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            marginBottom: '30px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          Which Anime Character
        </div>
        <div
          style={{
            fontSize: '80px',
            fontWeight: 900,
            color: 'white',
            textAlign: 'center',
            marginBottom: '40px',
            textShadow: '0 4px 20px rgba(0,0,0,0.3)',
          }}
        >
          Are You?
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: '40px',
            color: 'rgba(255,255,255,0.9)',
            textAlign: 'center',
            marginBottom: '50px',
          }}
        >
          Take the personality quiz • 2 minutes • 18 characters
        </div>

        {/* Stats */}
        <div
          style={{
            display: 'flex',
            gap: '40px',
            fontSize: '30px',
            color: 'white',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>🔥</span>
            <span>10K+ Taken</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>⭐</span>
            <span>Viral Quiz</span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <span>📱</span>
            <span>Easy to Share</span>
          </div>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
