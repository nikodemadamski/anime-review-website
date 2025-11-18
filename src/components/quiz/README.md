# Shareable Result Card Infrastructure

This directory contains the infrastructure for generating and sharing quiz result cards.

## Components

### ShareableResultCard
The main component that renders the shareable result card with Instagram Story dimensions (1080x1920px).

**Props:**
- `character: CharacterResult` - The character data to display
- `showForDownload?: boolean` - Whether to render at full resolution for download (default: false)

**Usage:**
```tsx
import { ShareableResultCard } from '@/components/quiz/ShareableResultCard';

<ShareableResultCard 
  character={characterResult} 
  showForDownload={false}
/>
```

### ShareableCardDemo
A demo component showing complete integration with image generation and download functionality.

**Props:**
- `character: CharacterResult` - The character data to display

**Usage:**
```tsx
import { ShareableCardDemo } from '@/components/quiz/ShareableCardDemo';

<ShareableCardDemo character={characterResult} />
```

## Utilities

### image-generator.ts
Core utilities for converting DOM elements to downloadable images.

**Functions:**
- `generateResultCardImage(elementId, options?)` - Generate PNG from DOM element
- `downloadImage(dataUrl, filename)` - Download image from data URL
- `dataUrlToFile(dataUrl, filename)` - Convert data URL to File object for sharing

**Example:**
```tsx
import { generateResultCardImage, downloadImage } from '@/lib/image-generator';

const dataUrl = await generateResultCardImage('shareable-card');
await downloadImage(dataUrl, 'my-result.png');
```

## Hooks

### useShareableCard
Custom hook for managing card generation, download, and sharing.

**Parameters:**
- `elementId: string` - ID of the DOM element to convert
- `filename?: string` - Filename for downloads (default: 'my-anime-character.png')
- `onSuccess?: () => void` - Callback on successful generation
- `onError?: (error: Error) => void` - Callback on error

**Returns:**
- `generateCard()` - Generate the image
- `downloadCard()` - Download the generated image
- `getShareFile()` - Get File object for native sharing
- `imageDataUrl` - The generated image data URL
- `isGenerating` - Loading state
- `error` - Error state
- `clearError()` - Clear error state

**Example:**
```tsx
import { useShareableCard } from '@/hooks/useShareableCard';

const {
  generateCard,
  downloadCard,
  isGenerating,
  error
} = useShareableCard({
  elementId: 'shareable-card',
  filename: 'my-character.png',
});

// Generate and download
await generateCard();
await downloadCard();
```

## Integration Example

```tsx
'use client';

import { ShareableResultCard } from '@/components/quiz/ShareableResultCard';
import { useShareableCard } from '@/hooks/useShareableCard';

export function QuizResult({ character }) {
  const { downloadCard, isGenerating } = useShareableCard({
    elementId: 'shareable-card',
    filename: `${character.id}.png`,
  });

  return (
    <div>
      <ShareableResultCard character={character} />
      
      <button onClick={downloadCard} disabled={isGenerating}>
        {isGenerating ? 'Generating...' : 'Download Card'}
      </button>
    </div>
  );
}
```

## Technical Details

- **Library:** html-to-image (converts DOM to PNG)
- **Image Format:** PNG with 2x pixel ratio for retina quality
- **Dimensions:** 1080x1920px (Instagram Story format)
- **Quality:** 1.0 (maximum quality)
- **Browser Support:** Modern browsers with Canvas API support

## Success Criteria

✅ Component renders in browser with placeholder data
✅ html-to-image can convert component to PNG
✅ Layout structure matches design mockup structure
✅ Props interface is flexible for all 18 characters
✅ Tests pass and no type errors
