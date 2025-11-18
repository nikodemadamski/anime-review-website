# Shareable Result Card - Design Specification

## Overview

This document defines the visual design system for shareable quiz result cards optimized for Instagram Stories, TikTok, and social media sharing. The design prioritizes being "Instagram-worthy," cute, and shareable while maintaining clear branding.

## Design Principles

1. **Instagram-worthy**: Beautiful enough that users want to post it on their story
2. **Cute**: Appeals to target demographic (25-year-old females who love anime)
3. **Clear branding**: Subtle but present - users know where to take the quiz
4. **Shareable**: Easy to understand at a glance, compelling to share

## Dimensions & Format

### Primary Format: Instagram Story
- **Dimensions**: 1080x1920px (9:16 aspect ratio)
- **Safe Zone**: 1080x1620px (avoid top/bottom 150px for UI elements)
- **Export Format**: PNG with transparency support
- **File Size Target**: < 2MB for fast sharing

### Future Formats (Post-MVP)
- Instagram Post: 1080x1080px (1:1)
- Twitter Card: 1200x675px (16:9)

## Layout Structure

### Vertical Hierarchy (1080x1920px)

```
┌─────────────────────────────────────┐
│                                     │ 0-150px: Safe zone (avoid)
│         [RARITY BADGE]              │ 150-250px: Rarity indicator
│                                     │
│                                     │
│      [CHARACTER IMAGE]              │ 250-1010px: Hero image (50%)
│         (Hero Section)              │
│                                     │
│                                     │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    "You are a [Character]!"         │ 1010-1400px: Personality (30%)
│                                     │
│    [Personality Trait Icons]        │
│    ✨ Trait 1  💫 Trait 2           │
│    🎭 Trait 3  ⭐ Trait 4           │
│                                     │
│    "From [Anime Name]"              │
│                                     │
├─────────────────────────────────────┤
│                                     │
│    [LOGO]    yoursite.com           │ 1400-1770px: Branding (20%)
│                                     │
│    [QR CODE]                        │
│                                     │
│    "Take the quiz!"                 │
│                                     │ 1770-1920px: Safe zone (avoid)
└─────────────────────────────────────┘
```

## Color System

### Character-Themed Gradients

Each character has a unique gradient background that matches their personality:

#### Legendary Characters (Warm, Bold)
- **Goku/Naruto/Luffy**: `linear-gradient(135deg, #FF6B35 0%, #FF8C00 100%)`
- **Saitama**: `linear-gradient(135deg, #FFD700 0%, #FFA500 100%)`
- **Levi**: `linear-gradient(135deg, #2F4F4F 0%, #4A5568 100%)`

#### Ultra-Rare Characters (Elegant, Mysterious)
- **Violet Evergarden**: `linear-gradient(135deg, #9370DB 0%, #DDA0DD 100%)`
- **Makima**: `linear-gradient(135deg, #FFD700 0%, #FF6B9D 100%)`
- **Mai**: `linear-gradient(135deg, #9370DB 0%, #B19CD9 100%)`

#### Rare Characters (Vibrant, Energetic)
- **Light Yagami**: `linear-gradient(135deg, #8B4513 0%, #A0522D 100%)`
- **Zero Two**: `linear-gradient(135deg, #FF1493 0%, #FF69B4 100%)`
- **Rem**: `linear-gradient(135deg, #87CEEB 0%, #B0E0E6 100%)`

### Text Colors (WCAG AA Compliant)

- **Primary Text**: `#FFFFFF` (white) with text-shadow for readability
- **Secondary Text**: `rgba(255, 255, 255, 0.9)`
- **Accent Text**: Character color with high contrast
- **Text Shadow**: `0 2px 8px rgba(0, 0, 0, 0.3)` for legibility on gradients

### Rarity Badge Colors

```typescript
{
  legendary: { bg: '#FFD700', text: '#000000', glow: 'rgba(255, 215, 0, 0.5)' },
  'ultra-rare': { bg: '#9D4EDD', text: '#FFFFFF', glow: 'rgba(157, 78, 221, 0.5)' },
  rare: { bg: '#FF6B9D', text: '#FFFFFF', glow: 'rgba(255, 107, 157, 0.5)' },
  uncommon: { bg: '#06B6D4', text: '#FFFFFF', glow: 'rgba(6, 182, 212, 0.5)' },
  common: { bg: '#8A867E', text: '#FFFFFF', glow: 'rgba(138, 134, 126, 0.5)' }
}
```

## Typography

### Font Stack

```css
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 
             'Helvetica Neue', Arial, sans-serif;
```

**Rationale**: System fonts ensure fast loading and consistent rendering across devices.

### Type Scale

```css
/* Character Name (Hero) */
.character-name {
  font-size: 72px;
  font-weight: 900;
  line-height: 1.1;
  letter-spacing: -0.02em;
}

/* Anime Title */
.anime-title {
  font-size: 36px;
  font-weight: 700;
  line-height: 1.2;
}

/* "You are a..." Heading */
.result-heading {
  font-size: 48px;
  font-weight: 800;
  line-height: 1.2;
}

/* Personality Traits */
.trait-text {
  font-size: 28px;
  font-weight: 600;
  line-height: 1.3;
}

/* Rarity Badge */
.rarity-badge {
  font-size: 24px;
  font-weight: 900;
  letter-spacing: 0.05em;
}

/* Branding Text */
.brand-text {
  font-size: 32px;
  font-weight: 700;
}

/* CTA Text */
.cta-text {
  font-size: 28px;
  font-weight: 600;
}
```

### Readability Guidelines

- **Minimum font size**: 24px (readable on mobile screenshots)
- **Line height**: 1.2-1.4 for headings, 1.5 for body text
- **Text shadow**: Always use on gradient backgrounds
- **Contrast ratio**: Minimum 4.5:1 (WCAG AA)

## Component Specifications

### 1. Rarity Badge (Top)

**Position**: Centered, 180px from top
**Size**: Auto width × 80px height
**Style**:
```css
{
  background: rarity-color with 30% opacity;
  border: 4px solid rarity-color;
  border-radius: 50px;
  padding: 16px 32px;
  box-shadow: 0 8px 32px rgba(rarity-color, 0.4);
  animation: pulse 2s infinite;
}
```

**Content**:
- Rarity emoji (left): 40px size
- Rarity text (right): 24px, uppercase, bold

### 2. Character Image (Hero)

**Position**: Centered, 280px from top
**Size**: 700px × 700px
**Style**:
```css
{
  border-radius: 40px;
  border: 8px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
  overflow: hidden;
}
```

**Image Treatment**:
- High-quality character portrait
- Centered and cropped to focus on face
- Subtle vignette overlay at edges
- Gradient overlay at bottom (for text readability)

### 3. Personality Section (Middle)

**Position**: 1050px from top
**Size**: Full width × 350px height
**Padding**: 60px horizontal

**Layout**:
```
"You are a [Character Name]!"
[Character Emoji - 80px]

[Trait Grid - 2×2 or 2×3]
✨ Determined    💫 Brave
🎭 Loyal        ⭐ Energetic

"From [Anime Name]"
```

**Trait Icons**:
- Size: 32px
- Spacing: 24px between icon and text
- Grid gap: 20px vertical, 32px horizontal

### 4. Branding Section (Bottom)

**Position**: 1450px from top
**Size**: Full width × 320px height
**Padding**: 60px horizontal

**Layout**:
```
[Logo - 120px height]

yoursite.com
[QR Code - 180px × 180px]

"Take the quiz to find your character!"
```

**QR Code**:
- Size: 180×180px (scannable from phone screen)
- Border: 8px white border
- Border radius: 20px
- Shadow: 0 8px 24px rgba(0, 0, 0, 0.2)
- URL: `https://yoursite.com/quiz?ref=share&char={characterId}`

**Logo**:
- Height: 100-120px
- Centered
- White or character-colored version

## Visual Effects

### Shadows & Depth

```css
/* Card Container */
.card-container {
  box-shadow: 0 30px 90px rgba(0, 0, 0, 0.3);
}

/* Text Shadows */
.text-shadow-strong {
  text-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
}

.text-shadow-subtle {
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.3);
}

/* Element Shadows */
.element-shadow {
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.2);
}
```

### Animations (For Web Preview)

```css
/* Rarity Badge Pulse */
@keyframes pulse {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.05); }
}

/* Fade In */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}
```

## Decorative Elements

### Background Patterns (Subtle)

- **Anime-themed icons**: Scattered stars, sparkles, or character-specific symbols
- **Opacity**: 5-10% (very subtle, not distracting)
- **Size**: 40-80px
- **Position**: Random but balanced

### Gradient Overlays

```css
/* Top to bottom fade for text readability */
.gradient-overlay-top {
  background: linear-gradient(180deg, 
    rgba(0, 0, 0, 0.3) 0%, 
    transparent 30%
  );
}

.gradient-overlay-bottom {
  background: linear-gradient(180deg, 
    transparent 70%, 
    rgba(0, 0, 0, 0.4) 100%
  );
}
```

## Character-Specific Variations

### Example 1: Naruto (Legendary)

```
Background: Orange gradient (#FF6B35 → #FF8C00)
Rarity Badge: Gold with pulse animation
Character Image: Naruto smiling, orange jacket visible
Traits: 🍜 Determined, 🦊 Brave, 👥 Loyal, ⚡ Energetic
Decorative: Ramen bowl icons, leaf symbols (subtle)
```

### Example 2: Violet Evergarden (Ultra-Rare)

```
Background: Purple gradient (#9370DB → #DDA0DD)
Rarity Badge: Purple diamond with glow
Character Image: Violet with flowers, elegant pose
Traits: 💌 Kind, ✨ Caring, 🌸 Empathetic, 🎭 Calm
Decorative: Letter/envelope icons, flower petals (subtle)
```

### Example 3: Zero Two (Rare)

```
Background: Pink gradient (#FF1493 → #FF69B4)
Rarity Badge: Pink star with sparkle
Character Image: Zero Two with horns, confident smile
Traits: 🦖 Passionate, 💕 Unique, ⚡ Brave, 💫 Loyal
Decorative: Dinosaur silhouettes, hearts (subtle)
```

## Accessibility Considerations

### Color Contrast
- All text must meet WCAG AA standards (4.5:1 minimum)
- Use text shadows to ensure readability on gradients
- Test with color blindness simulators

### Readability
- Minimum font size: 24px
- Clear hierarchy with size and weight
- Adequate spacing between elements

### QR Code
- High contrast (black on white)
- Adequate quiet zone (white border)
- Test scannability from various distances

## Export Specifications

### For Engineering Implementation

```typescript
interface CardDesignTokens {
  dimensions: {
    width: 1080;
    height: 1920;
    safeZoneTop: 150;
    safeZoneBottom: 150;
  };
  
  sections: {
    rarity: { top: 150, height: 100 };
    hero: { top: 280, height: 700 };
    personality: { top: 1050, height: 350 };
    branding: { top: 1450, height: 320 };
  };
  
  spacing: {
    horizontal: 60;
    vertical: 40;
    elementGap: 24;
  };
  
  borderRadius: {
    small: 20;
    medium: 40;
    large: 50;
  };
}
```

### Image Assets Needed

1. **Character Images**: 700×700px minimum, high quality
2. **Logo**: SVG or PNG with transparency, 300px height
3. **Trait Icons**: Emoji or SVG, 32px size
4. **Background Patterns**: SVG, subtle and scalable

## Testing Checklist

### Visual Quality
- [ ] Design looks good on Instagram Story preview
- [ ] Text is readable at phone screen size
- [ ] Colors are vibrant but not oversaturated
- [ ] Character image is high quality and well-cropped

### Branding
- [ ] Logo is visible but not overwhelming
- [ ] QR code is scannable from phone screen
- [ ] Website URL is readable
- [ ] Brand colors are consistent

### Shareability
- [ ] Passes "would I share this?" test with 5 team members
- [ ] Feels cute and Instagram-worthy
- [ ] Clear what action to take (scan QR or visit URL)
- [ ] Personality traits are relatable and accurate

### Technical
- [ ] File size < 2MB
- [ ] Exports at correct dimensions (1080×1920px)
- [ ] All fonts load correctly
- [ ] QR code generates correctly with tracking params

## Design Iterations

### Version 1.0 (MVP - Current)
- Single card design for all characters
- Character-themed gradients
- Basic trait display
- QR code and branding

### Version 1.1 (Future)
- Multiple card templates (users can choose)
- Animated GIF versions
- Personalized anime recommendations on card
- Social proof ("Join 10,000+ anime fans!")

### Version 2.0 (Future)
- Video card versions (15-second clips)
- AR filters for Instagram Stories
- Collaborative cards (compare with friends)
- Seasonal themes (holidays, events)

## Design System Files

### Figma Mockups (Deliverable)
1. `naruto-card-mockup.png` - Legendary example
2. `violet-card-mockup.png` - Ultra-rare example
3. `zero-two-card-mockup.png` - Rare example

### Design Tokens (Deliverable)
- `card-design-tokens.json` - All spacing, colors, sizes
- `character-gradients.json` - Gradient definitions per character
- `typography-scale.json` - Font sizes and weights

### Component Library (Deliverable)
- `ShareableResultCard.tsx` - React component
- `card-styles.css` - Shared styles
- `gradient-backgrounds.css` - Character gradients

## Notes from Design Review

**Jordan (UI/UX Designer)**: "The key is making it feel premium and shareable. Think Spotify Wrapped - people WANT to post it because it looks good and says something about them."

**Mei (Target Customer)**: "I love the cute aesthetic! The gradients are beautiful and the character images really pop. I would definitely share this on my Instagram story."

**Sarah (UX Manager)**: "The hierarchy is clear - you immediately see the character, then the traits, then the branding. The QR code is genius for mobile sharing."

**Alex (Software Engineer)**: "This is implementable with html-to-image. The gradient backgrounds and shadows will render well. We should test font loading to ensure consistency."

## Success Criteria

✅ Design passes "would I share this?" test with 5 team members
✅ QR code is scannable from phone screen (tested at 6 inches)
✅ Text is readable at Instagram Story size (tested on iPhone and Android)
✅ Branding is visible but not overwhelming (logo < 10% of card space)
✅ Character image is hero element (50% of card)
✅ Personality traits are clear and relatable
✅ Gradient backgrounds are vibrant and character-appropriate
✅ File size < 2MB for fast sharing

---

**Status**: ✅ Design Specification Complete
**Next Step**: Implement coded prototype and integrate into quiz result page
**Owner**: UI/UX Designer (Jordan) + Software Engineer (Alex)
