import { Suspense } from 'react';
import { BrowseContent } from './BrowseContent';
import { Container } from '@/components/ui';

export default function BrowsePage() {
  return (
    <Suspense
      fallback={
        <Container size="xl" className="py-12">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div
                className="animate-spin rounded-full h-12 w-12 border-b-2 mx-auto mb-4"
                style={{ borderColor: 'var(--accent)' }}
              ></div>
              <p style={{ color: 'var(--secondary)' }}>Loading anime...</p>
            </div>
          </div>
        </Container>
      }
    >
      <BrowseContent />
    </Suspense>
  );
}
