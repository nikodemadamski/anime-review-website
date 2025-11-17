import Link from 'next/link';
import { affiliateSettings } from '@/lib/affiliate/config';

interface AffiliateDisclosureProps {
  variant?: 'inline' | 'footer';
}

export function AffiliateDisclosure({ variant = 'inline' }: AffiliateDisclosureProps) {
  const { shortText, fullPolicyUrl } = affiliateSettings.disclosure;

  if (variant === 'footer') {
    return (
      <div 
        className="text-center py-4 border-t"
        style={{ 
          backgroundColor: 'var(--footer-bg)',
          borderColor: 'var(--border)',
          color: 'var(--muted)'
        }}
      >
        <p className="text-xs">
          {shortText}{' '}
          <Link 
            href={fullPolicyUrl}
            className="underline hover:no-underline"
            style={{ color: 'var(--accent)' }}
          >
            Learn more
          </Link>
        </p>
      </div>
    );
  }

  return (
    <div 
      className="rounded-lg p-3 border text-center"
      style={{
        backgroundColor: 'var(--text-block)',
        borderColor: 'var(--border)'
      }}
    >
      <p className="text-xs" style={{ color: 'var(--muted)' }}>
        ℹ️ {shortText}{' '}
        <Link 
          href={fullPolicyUrl}
          className="underline hover:no-underline font-semibold"
          style={{ color: 'var(--accent)' }}
        >
          Learn more
        </Link>
      </p>
    </div>
  );
}
