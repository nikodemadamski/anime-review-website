import { Suspense } from 'react';
import { BrowseContent } from './BrowseContent';
import { BrowseErrorBoundary } from '@/components/browse/BrowseErrorBoundary';

export default function BrowsePage() {
  return (
    <BrowseErrorBoundary>
      <Suspense fallback={<div>Loading...</div>}>
        <BrowseContent />
      </Suspense>
    </BrowseErrorBoundary>
  );
}
