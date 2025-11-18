'use client';

import { useState } from 'react';

export function ImageUpgradeButton() {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);

  const handleUpgrade = async () => {
    if (!confirm('This will upgrade all anime cover images to high quality. Continue?')) {
      return;
    }

    setLoading(true);
    setMessage('');
    setShowMessage(false);

    try {
      const response = await fetch('/api/dev/upgrade-images', {
        method: 'POST',
      });

      const data = await response.json();

      if (data.success) {
        setMessage(`✅ Success! Upgraded ${data.updatedCount} of ${data.totalAnime} images`);
      } else {
        setMessage(`❌ Error: ${data.error}`);
      }
      setShowMessage(true);

      // Auto-hide message after 5 seconds
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    } catch (error) {
      setMessage('❌ Failed to upgrade images');
      setShowMessage(true);
      setTimeout(() => {
        setShowMessage(false);
      }, 5000);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {/* Hidden Dev Button - Inline text style, bottom left */}
      <button
        onClick={handleUpgrade}
        disabled={loading}
        className="fixed bottom-2 left-2 z-[9999] text-[10px] font-mono transition-opacity duration-300 opacity-5 hover:opacity-100"
        style={{
          color: '#FF6B9D',
          textDecoration: 'underline',
          background: 'transparent',
        }}
        title="Dev Tool: Upgrade anime cover images to high quality"
      >
        {loading ? 'upgrading...' : 'dev:upgrade'}
      </button>

      {/* Success/Error Message Toast */}
      {showMessage && (
        <div
          className="fixed bottom-16 left-2 z-[9999] px-4 py-3 rounded-lg text-sm font-semibold shadow-xl animate-fade-in"
          style={{
            backgroundColor: message.includes('✅') ? '#10B981' : '#EF4444',
            color: '#FFFFFF',
            maxWidth: '300px',
          }}
        >
          {message}
        </div>
      )}
    </>
  );
}
