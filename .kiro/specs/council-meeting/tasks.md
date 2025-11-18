# Implementation Plan - Council Priority Features

## Overview

This implementation plan addresses the top 3 features identified by the Council and prioritized by the CEO:
1. **Shareable Quiz Result Cards** (Primary viral growth mechanism)
2. **Mobile Menu Critical Fix** (Foundation - 2 hour fix)
3. **Personalized Anime Recommendations** (Retention driver)

Timeline: 4 days
Team: Software Engineer, Data Scientist, UI/UX Designer, Project Manager, Director of Technology

## Sprint 1: Foundation (Day 1)

### Mobile Menu Critical Fix

**Context:** The Council identified that 70% of traffic will be mobile (especially from social shares). Currently, the mobile menu is broken - users can interact with content behind the menu, scroll the background, and can't close it by tapping outside. This creates confusion and frustration. The CEO mandated we fix this FIRST before driving any traffic via sharing, because a broken mobile experience will kill conversion. This is a 2-hour fix, not a 2-day project - we're only fixing the critical bug, not perfecting the entire mobile UX.

**Why this matters:** If we launch shareable cards and drive mobile traffic to a broken navigation, users will bounce immediately. This is table stakes - we don't get credit for fixing it, but we lose users if we don't.

- [x] 1. Fix mobile menu overlay and backdrop
  
  **Rationale:** The mobile menu currently lacks a backdrop overlay, which means:
  - Users can accidentally tap content behind the menu (confusing)
  - There's no visual indication the menu is "modal" (poor UX)
  - Users don't know how to close the menu (no obvious action)
  
  **What we're building:**
  - Semi-transparent backdrop (rgba(0,0,0,0.5)) that covers the entire screen
  - Backdrop sits between menu (z-50) and page content (z-0 to z-30)
  - Clicking/tapping the backdrop closes the menu
  - Body scroll is locked when menu is open (prevents background scrolling)
  - Smooth fade-in/fade-out transitions (200-300ms) for polish
  
  **Technical approach:**
  - Create `MobileMenuBackdrop.tsx` component
  - Use `useBodyScrollLock` hook to manage scroll behavior
  - Update `Header.tsx` to render backdrop when menu is open
  - Test on iOS Safari (scroll lock is tricky) and Android Chrome
  
  **Success criteria:**
  - Menu opens with backdrop visible
  - Tapping outside menu closes it
  - Background doesn't scroll when menu is open
  - Smooth animations, no janky behavior
  - Works on iOS Safari and Android Chrome
  
  _Requirements: browse-critical-mvp Req 1_
  _Estimated: 2-3 hours_
  _Owner: Software Engineer_

### Shareable Cards - Foundation

**Context:** The Council unanimously agreed that shareable result cards are THE viral growth mechanism. Currently, quiz completion rate is ~60-70%, but share rate is <5% because there's no visual to share. Maya (new grad) pointed out that in 2025, text links are dead - everything viral has a graphic (Spotify Wrapped, personality quizzes on TikTok). Robert (investor) emphasized this is the ONLY feature that creates new users - everything else is optimization. The CEO made this Priority #1.

**Why this matters:** Every share brings new users. If we achieve 20% share rate and each share reaches 50 people, that's a viral coefficient >1.0 (exponential growth). Without this, we're stuck with organic traffic and paid ads (expensive, slow).

- [x] 2. Design shareable result card mockups
  
  **Rationale:** The visual design is critical - this is what people will post on Instagram, TikTok, Twitter. If it's not beautiful and Instagram-worthy, people won't share it. Mei (target customer) said "I want something cute I can post" - the design needs to appeal to our core demographic (25-year-old females who love anime and aesthetics).
  
  **What we're designing:**
  - **Dimensions:** 1080x1920px (Instagram Story format) - this is the most shared format in 2025
  - **Layout hierarchy:**
    1. Character image (top 50%) - hero element, high quality, eye-catching
    2. Personality traits (middle 30%) - 3-5 traits with icons, clean typography
    3. Branding (bottom 20%) - logo, QR code, website URL (subtle but present)
  - **Color scheme:** Gradient backgrounds matching character themes, high contrast text (WCAG AA)
  - **Typography:** Clean, modern fonts that are readable at small sizes (mobile)
  - **QR code:** Scannable but not dominant - allows easy sharing without typing URL
  
  **Design principles:**
  - "Instagram-worthy" - would you post this on your story?
  - "Cute" - appeals to target demographic (Mei's feedback)
  - "Clear branding" - people know where to go to take the quiz
  - "Shareable" - includes pre-filled share text and easy sharing
  
  **Deliverables:**
  - Figma mockups for 2-3 character examples
  - Design system (colors, fonts, spacing)
  - Export specifications for engineering
  - Variations showing different character themes
  
  **Success criteria:**
  - Design passes "would I share this?" test with 5 team members
  - QR code is scannable from phone screen
  - Text is readable at Instagram Story size
  - Branding is visible but not overwhelming
  
  _Requirements: council-meeting viral growth_
  _Estimated: 4-6 hours_
  _Owner: UI/UX Designer (Jordan)_

- [x] 3. Set up result card component infrastructure
  
  **Rationale:** While design is being finalized, engineering can set up the technical foundation. This allows parallel work - designer creates mockups, engineer builds the component structure. By end of Day 1, we have both design and infrastructure ready to combine on Day 2.
  
  **What we're building:**
  - React component that renders the result card in the DOM
  - Props interface for character data, personality traits, quiz scores
  - Integration with html-to-image library (converts DOM to PNG)
  - Basic layout structure that matches design mockups
  
  **Technical decisions:**
  - **Library choice:** html-to-image vs canvas API
    - html-to-image: Easier to style with CSS, matches design exactly
    - canvas API: More control, potentially faster
    - **Decision:** Start with html-to-image (faster development), can optimize later
  - **Component structure:** Separate presentational component from image generation logic
  - **Props design:** Make it flexible for future iterations (different card designs)
  
  **Why html-to-image:**
  - Designer can style with CSS (familiar workflow)
  - Exact match between what user sees and what gets downloaded
  - Easier to iterate on design without touching image generation code
  - Library is well-maintained and battle-tested
  
  **Deliverables:**
  - `ShareableResultCard.tsx` component with props interface
  - html-to-image library installed and configured
  - Basic layout structure (divs, styling hooks)
  - Example usage in quiz result page
  
  **Success criteria:**
  - Component renders in browser with placeholder data
  - html-to-image can convert component to PNG
  - Layout structure matches design mockup structure
  - Props interface is flexible for all 18 characters
  
  _Requirements: council-meeting viral growth_
  _Estimated: 2-3 hours_
  _Owner: Software Engineer (Alex)_

## Sprint 2: Shareable Cards Complete (Days 2-3)

**Context:** Day 1 gave us the foundation - mobile menu is fixed, design mockups are ready, component infrastructure is in place. Now we build the actual shareable cards that will drive viral growth. The Council emphasized these need to be "Instagram-worthy" - beautiful enough that people actually want to share them. This is where we convert the design mockups into working, downloadable graphics.

**Why Days 2-3:** This is the most complex feature. We're not just building a component - we're building image generation, download functionality, social sharing, and analytics. The CEO wants this shipped by end of Day 3 so we can start measuring share rate immediately.

- [x] 4. Implement result card visual design

**Rationale:** This is where design meets engineering. We take Jordan's mockups and translate them into pixel-perfect React components. The visual quality here directly impacts share rate - if it looks amateur, people won't share it. If it looks professional and cute, share rate goes up.

- [x] 4.1 Build card layout component
  
  **Why this task:** The card layout is the foundation of the visual design. We need to implement the exact design from mockups - spacing, colors, typography, hierarchy. This is what users will see before they download, and what will appear in their shared images.
  
  **What we're building:**
  - **Character image section:**
    - High-resolution image display (1080px width for retina quality)
    - Centered positioning with proper aspect ratio
    - Subtle gradient overlay at bottom for text readability
    - Fallback if character image fails to load
  
  - **Personality traits section:**
    - 3-5 traits displayed with icons (✨, 🎭, 💫, etc.)
    - Clean typography hierarchy (character name large, traits medium)
    - Proper spacing and alignment
    - Color-coded based on character theme
  
  - **Branding section:**
    - Logo positioned subtly (bottom corner)
    - Tagline or site name
    - Decorative elements matching brand
  
  - **Background and decorative elements:**
    - Gradient backgrounds matching character personality
    - Subtle patterns or shapes
    - Border radius and shadows for depth
  
  **Technical considerations:**
  - Use CSS-in-JS or Tailwind for styling (matches existing codebase)
  - Ensure fonts load before image generation (avoid blank text)
  - Use absolute positioning for precise layout control
  - Test rendering at 1080x1920px dimensions
  
  **Success criteria:**
  - Card matches design mockup pixel-perfect
  - All 18 characters render correctly with their themes
  - Text is readable at Instagram Story size
  - Images load properly and are high quality
  - Layout doesn't break with different trait lengths
  
  _Requirements: council-meeting viral growth_
  _Estimated: 4 hours_
  _Owner: Software Engineer (Alex) + UI/UX Designer (Jordan) for review_

- [x] 4.2 Add QR code and URL
  
  **Why this task:** The QR code is critical for mobile sharing. When someone sees the card on Instagram, they can scan the QR code instantly instead of typing a URL. This reduces friction in the viral loop. Robert (investor) emphasized: "Every point of friction kills 50% of conversions."
  
  **What we're building:**
  - QR code generation using qrcode.react library
  - Points to quiz landing page with UTM parameters for tracking
  - Sized for scannability (minimum 100x100px at final resolution)
  - Positioned in bottom corner (visible but not dominant)
  - Website URL in readable text next to QR code
  
  **Why QR code matters:**
  - Mobile users can't click links in images
  - Typing URLs is high friction (most people won't do it)
  - QR codes are familiar and trusted in 2025
  - Allows tracking of scan-to-visit conversion
  
  **Technical approach:**
  - Use qrcode.react library for generation
  - URL format: `https://yoursite.com/quiz?ref=share&char={characterId}`
  - Test scannability with multiple phone cameras
  - Ensure QR code renders in final image (not just DOM)
  
  **Success criteria:**
  - QR code scans successfully on iOS and Android
  - URL includes tracking parameters
  - QR code is visible but doesn't dominate design
  - Text URL is readable as backup
  
  _Requirements: council-meeting viral growth_
  _Estimated: 1 hour_
  _Owner: Software Engineer (Alex)_

- [x] 4.3 Implement download functionality
  
  **Why this task:** This is the core technical challenge - converting a DOM element into a downloadable image. Users need to be able to save the card to their camera roll and share it anywhere (Instagram, TikTok, Twitter, WhatsApp). The download needs to be fast (<3 seconds), high quality, and work on all devices.
  
  **What we're building:**
  - Image generation using html-to-image library
  - "Download Result" button with clear CTA
  - Loading state while image generates (spinner + "Generating your card...")
  - Error handling if generation fails
  - Automatic download to device
  - File naming: `my-anime-character-{characterName}.png`
  
  **Technical challenges:**
  - **Performance:** Image generation can take 1-3 seconds
    - Solution: Show loading state, generate on user action (not automatically)
  - **Quality:** Need high resolution for social media
    - Solution: Generate at 2x pixel ratio (2160x3840px), downscale for web
  - **Fonts:** Custom fonts might not load in generated image
    - Solution: Ensure fonts are loaded before generation, use font-display: block
  - **Cross-browser:** Safari handles canvas differently than Chrome
    - Solution: Test on both, use html-to-image (handles cross-browser)
  
  **Why html-to-image:**
  - Converts DOM directly to PNG (what you see is what you get)
  - Handles CSS, fonts, images automatically
  - Works cross-browser with minimal config
  - Can specify pixel ratio for retina quality
  
  **Implementation details:**
  ```typescript
  const handleDownload = async () => {
    setIsGenerating(true);
    try {
      const element = document.getElementById('shareable-card');
      const dataUrl = await toPng(element, {
        quality: 1.0,
        pixelRatio: 2, // Retina quality
        width: 1080,
        height: 1920,
      });
      
      // Trigger download
      const link = document.createElement('a');
      link.download = `my-anime-character-${character.name}.png`;
      link.href = dataUrl;
      link.click();
      
      trackEvent('result_card_downloaded', { characterId });
    } catch (error) {
      console.error('Download failed:', error);
      showErrorMessage('Failed to generate image. Please try again.');
    } finally {
      setIsGenerating(false);
    }
  };
  ```
  
  **Success criteria:**
  - Download works on iOS Safari, Android Chrome, desktop browsers
  - Image quality is high (no pixelation or blur)
  - Generation completes in <3 seconds
  - Loading state shows during generation
  - Error handling works if generation fails
  - Downloaded file has correct dimensions (1080x1920px)
  
  _Requirements: council-meeting viral growth_
  _Estimated: 3 hours_
  _Owner: Software Engineer (Alex)_

- [ ] 5. Implement social sharing functionality

**Rationale:** Downloading the card is good, but we need to make sharing as frictionless as possible. Sarah (UX Manager) pointed out that every extra step reduces conversion by 50%. We need one-tap sharing to Instagram, Twitter, Facebook, and WhatsApp. The pre-filled share text is critical - it needs to be compelling enough that people don't change it, and it needs to include a clear CTA for friends to take the quiz.

- [x] 5.1 Add social share buttons
  
  **Why this task:** Not everyone will use native sharing (Web Share API). Desktop users, older devices, and some browsers need traditional share buttons. These buttons also allow us to track which platforms people prefer, informing future optimization.
  
  **What we're building:**
  - **Share buttons for:**
    - Twitter (largest anime community on social media)
    - Facebook (still relevant for older demographics)
    - Copy Link (universal fallback, works everywhere)
    - WhatsApp (huge in international markets, especially Ireland where Mei lives)
  
  - **Pre-filled share text:**
    - Format: "I'm a [Character Name]! Which anime character are you? 🎭✨ [URL]"
    - Why this works:
      - Personal ("I'm a...") - makes it about the sharer
      - Question ("Which character are you?") - creates curiosity
      - Emojis (🎭✨) - increases engagement on social media
      - Clear CTA - friends know exactly what to do
  
  - **Button styling:**
    - Platform colors (Twitter blue, Facebook blue, WhatsApp green)
    - Icons for each platform (recognizable)
    - Hover states and animations
    - Mobile-friendly touch targets (44x44px minimum)
  
  **Technical implementation:**
  ```typescript
  const shareText = `I'm a ${character.name}! Which anime character are you? 🎭✨`;
  const shareUrl = `https://yoursite.com/quiz?ref=${character.id}`;
  
  const handleTwitterShare = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(shareUrl)}`;
    window.open(url, '_blank', 'width=550,height=420');
    trackEvent('result_card_shared', { platform: 'twitter', characterId });
  };
  
  const handleCopyLink = async () => {
    await navigator.clipboard.writeText(`${shareText} ${shareUrl}`);
    showToast('Link copied! Share it with your friends 🎉');
    trackEvent('result_card_shared', { platform: 'copy', characterId });
  };
  ```
  
  **Why these platforms:**
  - **Twitter:** Largest anime community, high engagement
  - **Facebook:** Still used by 2.9B people, can't ignore
  - **WhatsApp:** Huge in international markets, personal sharing
  - **Copy Link:** Universal fallback, works everywhere
  
  **Analytics tracking:**
  - Track which platform is clicked
  - Track character being shared
  - Track time of day (when do people share?)
  - Track device type (mobile vs desktop)
  
  **Success criteria:**
  - All share buttons open correct platform with pre-filled text
  - Copy link copies to clipboard and shows confirmation
  - Buttons work on mobile and desktop
  - Analytics events fire correctly
  - Share text includes character name and URL
  
  _Requirements: council-meeting viral growth_
  _Estimated: 2 hours_
  _Owner: Software Engineer (Alex)_

- [x] 5.2 Implement Web Share API
  
  **Why this task:** The Web Share API is the gold standard for mobile sharing in 2025. It opens the native share sheet (same as sharing a photo from camera roll), which includes ALL apps the user has installed - Instagram, TikTok, Snapchat, Telegram, email, SMS, etc. This is much better than custom buttons because it adapts to each user's preferences.
  
  **What we're building:**
  - Native share functionality using navigator.share()
  - Includes the generated image file in share payload
  - Includes share text and URL
  - Fallback to custom buttons if Web Share API not supported
  - Progressive enhancement approach
  
  **Why Web Share API is critical:**
  - **User preference:** Opens apps the user actually uses
  - **Lower friction:** One tap vs multiple taps
  - **Image included:** Can share image directly to Instagram Stories
  - **Native feel:** Feels like sharing a photo, not using a website
  
  **Technical challenges:**
  - **Browser support:** Only works on mobile Safari, Chrome, Edge (not desktop)
    - Solution: Feature detection, fallback to custom buttons
  - **File sharing:** Not all browsers support sharing files
    - Solution: Check navigator.canShare({ files: [...] })
  - **Image format:** Need to convert data URL to File object
    - Solution: Fetch data URL, convert to Blob, create File
  
  **Implementation:**
  ```typescript
  const handleNativeShare = async () => {
    if (!navigator.share) {
      // Fallback to custom buttons
      setShowCustomButtons(true);
      return;
    }
    
    try {
      // Convert image data URL to File
      const response = await fetch(imageDataUrl);
      const blob = await response.blob();
      const file = new File([blob], 'my-anime-character.png', { 
        type: 'image/png' 
      });
      
      // Check if file sharing is supported
      if (navigator.canShare && navigator.canShare({ files: [file] })) {
        await navigator.share({
          title: `I'm a ${character.name}!`,
          text: shareText,
          url: shareUrl,
          files: [file],
        });
        
        trackEvent('result_card_shared', { 
          platform: 'native', 
          characterId,
          includesImage: true 
        });
      } else {
        // Share without image
        await navigator.share({
          title: `I'm a ${character.name}!`,
          text: shareText,
          url: shareUrl,
        });
        
        trackEvent('result_card_shared', { 
          platform: 'native', 
          characterId,
          includesImage: false 
        });
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        // User cancelled, don't track as error
        return;
      }
      console.error('Share failed:', error);
      // Fallback to custom buttons
      setShowCustomButtons(true);
    }
  };
  ```
  
  **Why this approach:**
  - Progressive enhancement (works everywhere, better on mobile)
  - Graceful degradation (falls back to custom buttons)
  - Includes image when possible (Instagram Stories!)
  - Tracks success and failures for optimization
  
  **Testing requirements:**
  - Test on iOS Safari (primary target)
  - Test on Android Chrome (second target)
  - Test with and without image sharing support
  - Test user cancellation (don't track as error)
  - Test fallback to custom buttons on desktop
  
  **Success criteria:**
  - Native share sheet opens on mobile devices
  - Image is included in share payload when supported
  - Share text and URL are pre-filled
  - Fallback works on unsupported browsers
  - User cancellation is handled gracefully
  - Analytics track share attempts and completions
  
  _Requirements: council-meeting viral growth_
  _Estimated: 2 hours_
  _Owner: Software Engineer (Alex)_

- [ ] 6. Integrate shareable cards into quiz result page
  
  **Why this task:** All the pieces are built - now we need to put them together in the actual user flow. The quiz result page is the moment of highest engagement (user just got their character match, they're excited). We need to capitalize on that excitement by making sharing the obvious next step.
  
  **What we're building:**
  - Add ShareableResultCard component to quiz result page
  - Position it prominently (above the fold on mobile)
  - Add clear, compelling CTA buttons
  - Ensure smooth user flow: quiz → result → see card → share
  
  **User flow considerations:**
  - **Placement:** Card should be the first thing users see after character reveal
  - **CTA hierarchy:**
    1. Primary: "Share Your Result" (native share on mobile)
    2. Secondary: "Download Card" (for manual sharing)
    3. Tertiary: Individual platform buttons (Twitter, Facebook, etc.)
  - **Mobile-first:** 70% of users are mobile, optimize for that experience
  - **Loading:** Card should render immediately (no waiting)
  
  **Why placement matters:**
  - Sarah (UX Manager): "The moment someone gets their result is peak engagement. That's when they're most likely to share."
  - If we bury the share option below other content, share rate drops 50%
  - Mobile users won't scroll - it needs to be visible immediately
  
  **Technical implementation:**
  ```typescript
  // In QuizResult.tsx
  <div className="quiz-result-page">
    {/* Character reveal animation */}
    <CharacterReveal character={matchedCharacter} />
    
    {/* Shareable card - PROMINENT PLACEMENT */}
    <section className="share-section">
      <h2>Share Your Result!</h2>
      <p>Show your friends which character you got 🎭</p>
      
      <ShareableResultCard
        character={matchedCharacter}
        personalityTraits={personalityTraits}
        quizScore={quizScore}
      />
      
      <div className="share-actions">
        <button 
          onClick={handleNativeShare}
          className="primary-cta"
        >
          📱 Share Your Result
        </button>
        
        <button 
          onClick={handleDownload}
          className="secondary-cta"
        >
          ⬇️ Download Card
        </button>
      </div>
      
      <SocialShareButtons
        character={matchedCharacter}
        shareUrl={shareUrl}
      />
    </section>
    
    {/* Other content below */}
    <CharacterDescription character={matchedCharacter} />
    <RecommendationsSection character={matchedCharacter} />
  </div>
  ```
  
  **Mobile responsive considerations:**
  - Card should be full-width on mobile (maximize visibility)
  - Buttons should be large enough to tap (44x44px minimum)
  - Share section should be above the fold (no scrolling required)
  - Loading states should be smooth (no layout shift)
  
  **Success criteria:**
  - Card renders immediately on result page
  - Share buttons are visible without scrolling (mobile)
  - Layout is responsive (mobile, tablet, desktop)
  - User flow is intuitive (no confusion about what to do)
  - All props are passed correctly to ShareableResultCard
  
  _Requirements: council-meeting viral growth_
  _Estimated: 2 hours_
  _Owner: Software Engineer (Alex)_

- [ ] 7. Add analytics tracking for sharing
  
  **Why this task:** The CEO's directive is clear: "Ship fast, measure fast, learn fast." We need comprehensive analytics to know if the shareable cards are working. Without data, we're flying blind. We need to track every step of the funnel: view → download → share → click.
  
  **What we're tracking:**
  - **result_card_viewed:** User sees the shareable card
  - **result_card_downloaded:** User downloads the card
  - **result_card_shared:** User shares via any method
  - **share_button_clicked:** User clicks a specific share button
  - **share_link_clicked:** Someone clicks a shared link (conversion!)
  
  **Why each metric matters:**
  - **View rate:** Baseline - how many people see the card?
  - **Download rate:** Interest indicator - do people want to save it?
  - **Share rate:** THE metric - are people actually sharing?
  - **Platform breakdown:** Which platforms work best? (optimize future efforts)
  - **Conversion rate:** Do shared links bring new users?
  
  **Analytics implementation:**
  ```typescript
  // When card is rendered
  useEffect(() => {
    trackEvent('result_card_viewed', {
      characterId: character.id,
      characterName: character.name,
      timestamp: new Date().toISOString(),
      deviceType: isMobile ? 'mobile' : 'desktop',
    });
  }, [character]);
  
  // When user downloads
  const handleDownload = async () => {
    await downloadImage(imageDataUrl, filename);
    
    trackEvent('result_card_downloaded', {
      characterId: character.id,
      downloadMethod: 'button_click',
      fileSize: imageDataUrl.length,
      timestamp: new Date().toISOString(),
    });
  };
  
  // When user shares
  const handleShare = async (platform: string) => {
    // ... sharing logic ...
    
    trackEvent('result_card_shared', {
      characterId: character.id,
      platform: platform, // 'native', 'twitter', 'facebook', etc.
      includesImage: hasImage,
      timestamp: new Date().toISOString(),
    });
  };
  
  // When someone clicks a shared link (tracked via URL params)
  // In quiz landing page
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const refCharacter = urlParams.get('ref');
    
    if (refCharacter) {
      trackEvent('share_link_clicked', {
        referrerCharacter: refCharacter,
        timestamp: new Date().toISOString(),
      });
    }
  }, []);
  ```
  
  **Funnel analysis:**
  ```
  100 users complete quiz
  ↓ (result_card_viewed)
  95 users see shareable card (95% view rate)
  ↓ (result_card_downloaded)
  48 users download card (50% download rate)
  ↓ (result_card_shared)
  19 users share card (20% share rate) ← TARGET METRIC
  ↓ (share_link_clicked)
  95 new users click shared links (5x multiplier)
  ↓
  Viral coefficient = 0.95 (need >1.0 for exponential growth)
  ```
  
  **Dashboard metrics to monitor:**
  - Share rate by character (which characters get shared most?)
  - Share rate by platform (Twitter vs Facebook vs native?)
  - Share rate by device (mobile vs desktop?)
  - Share rate by time of day (when do people share?)
  - Conversion rate (shared link → quiz start)
  - Viral coefficient (new users per existing user)
  
  **Success criteria:**
  - All events fire correctly in analytics dashboard
  - Events include relevant metadata (character, platform, device)
  - Funnel can be reconstructed from events
  - No PII is tracked (privacy compliant)
  - Events fire on all browsers and devices
  
  _Requirements: council-meeting analytics_
  _Estimated: 1 hour_
  _Owner: Software Engineer (Alex) + Data Scientist (Priya) for analysis_

## Sprint 3: Personalized Recommendations (Day 4)

**Context:** Shareable cards are shipped and driving traffic. Now we need to convert quiz-takers into browsers and returning users. Currently, the quiz result page is a dead end - users get their character match and leave. Sarah (UX Manager) pointed out: "We're getting people to the door, but not inviting them inside." Recommendations solve this by answering the question: "Okay, I got my character... now what should I watch?"

**Why Day 4:** The CEO wants to ship this quickly while maintaining quality. By Day 4, we have data on share rates and can optimize recommendations based on early user behavior. This is the retention play that complements the viral growth from shareable cards.

**Business impact:** If 50% of quiz-takers click a recommendation, and 30% add to watchlist, we've converted casual visitors into engaged users. That's the difference between a one-time visitor and a returning user.

- [ ] 8. Build recommendation matching algorithm

**Rationale:** The recommendation algorithm is the brain of this feature. It needs to feel personalized ("these anime are perfect for ME") while being simple enough to ship in one day. Priya (Data Scientist) proposed a category-weight approach: each character has preferences for Visual, Music, Story, and Character ratings. We match anime that score high in those categories.

**Why this approach:**
- **Simple:** Can implement in a few hours, no ML required
- **Explainable:** We can tell users WHY we recommended something
- **Effective:** Leverages our unique 4-category rating system
- **Iteratable:** Can add ML later once we have user behavior data

- [ ] 8.1 Create character-to-anime matching logic
  
  **Why this task:** Each of the 18 characters represents a different personality type and anime preference. Luffy (adventurous, action-focused) should get different recommendations than Violet Evergarden (emotional, visual-focused). We need to define these preferences and implement the matching logic.
  
  **What we're building:**
  - Character profiles with category weights
  - Scoring algorithm that ranks anime by match quality
  - Randomization to prevent identical results
  - Match reasons (why we recommended this anime)
  
  **Character profile example:**
  ```typescript
  {
    id: 'luffy',
    name: 'Monkey D. Luffy',
    categoryWeights: {
      visual: 0.2,   // Doesn't care much about animation quality
      music: 0.1,    // Music is nice but not priority
      story: 0.4,    // LOVES adventure and plot
      character: 0.3, // Values strong characters and friendship
    },
    preferredGenres: ['Action', 'Adventure', 'Shounen'],
  }
  
  {
    id: 'violet-evergarden',
    name: 'Violet Evergarden',
    categoryWeights: {
      visual: 0.4,   // Appreciates beautiful animation
      music: 0.3,    // Emotional soundtracks matter
      story: 0.2,    // Story is important but not primary
      character: 0.1, // Character development is key
    },
    preferredGenres: ['Drama', 'Slice of Life', 'Romance'],
  }
  ```
  
  **Scoring algorithm:**
  ```typescript
  function calculateMatchScore(character, anime) {
    // Weighted score based on category preferences
    const categoryScore = 
      (anime.ratings.visual * character.weights.visual) +
      (anime.ratings.music * character.weights.music) +
      (anime.ratings.story * character.weights.story) +
      (anime.ratings.character * character.weights.character);
    
    // Bonus for genre match
    const genreBonus = anime.genres.filter(g => 
      character.preferredGenres.includes(g)
    ).length * 0.5;
    
    return categoryScore + genreBonus;
  }
  ```
  
  **Why this works:**
  - **Personalized:** Different characters get different recommendations
  - **Data-driven:** Uses our actual rating data
  - **Transparent:** We can explain why we recommended something
  - **Fast:** Runs in milliseconds, no API calls needed
  
  **Randomization strategy:**
  - Get top 16 matches (2x what we need)
  - Randomly select 8 from those 16
  - Prevents users from seeing identical results if they retake quiz
  - Allows for discovery of different anime
  
  **Match reasons generation:**
  ```typescript
  function getMatchReasons(character, anime) {
    const reasons = [];
    
    // Find top 2 weighted categories
    const topCategories = Object.entries(character.weights)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 2);
    
    topCategories.forEach(([category, weight]) => {
      if (weight > 0.3 && anime.ratings[category] > 8.0) {
        reasons.push(`Exceptional ${category}`);
      }
    });
    
    // Genre matches
    const matchingGenres = anime.genres.filter(g =>
      character.preferredGenres.includes(g)
    );
    if (matchingGenres.length > 0) {
      reasons.push(`${matchingGenres[0]} genre`);
    }
    
    return reasons;
  }
  ```
  
  **Success criteria:**
  - Algorithm returns 8 recommendations per character
  - Recommendations are relevant (high category match)
  - Results include match reasons
  - Randomization works (different results on retake)
  - Algorithm runs in <100ms
  
  _Requirements: council-meeting retention_
  _Estimated: 3 hours_
  _Owner: Data Scientist (Priya) + Software Engineer (Alex)_

- [ ] 8.2 Create recommendations data structure
  
  **Why this task:** We need to define the personality and preferences for all 18 characters. This is where Priya's data science expertise comes in - analyzing each character's traits and mapping them to anime preferences. This data structure drives the entire recommendation system.
  
  **What we're building:**
  - Complete character profiles for all 18 characters
  - Category weights that reflect each character's personality
  - Preferred genres based on character traits
  - Fallback logic if not enough high-quality matches
  
  **Character analysis process:**
  1. Review character personality traits from quiz
  2. Determine which rating categories matter most to that personality
  3. Assign weights (must sum to 1.0)
  4. Select 2-3 preferred genres
  5. Validate with team (does this make sense?)
  
  **Example character profiles:**
  ```typescript
  export const CHARACTER_PROFILES = {
    // Action-oriented characters
    'luffy': {
      categoryWeights: { visual: 0.2, music: 0.1, story: 0.4, character: 0.3 },
      preferredGenres: ['Action', 'Adventure', 'Shounen'],
    },
    'goku': {
      categoryWeights: { visual: 0.3, music: 0.1, story: 0.3, character: 0.3 },
      preferredGenres: ['Action', 'Martial Arts', 'Shounen'],
    },
    
    // Emotional/artistic characters
    'violet-evergarden': {
      categoryWeights: { visual: 0.4, music: 0.3, story: 0.2, character: 0.1 },
      preferredGenres: ['Drama', 'Slice of Life'],
    },
    'shinji-ikari': {
      categoryWeights: { visual: 0.3, music: 0.2, story: 0.3, character: 0.2 },
      preferredGenres: ['Psychological', 'Drama', 'Mecha'],
    },
    
    // Strategic/intellectual characters
    'light-yagami': {
      categoryWeights: { visual: 0.2, music: 0.2, story: 0.4, character: 0.2 },
      preferredGenres: ['Thriller', 'Psychological', 'Mystery'],
    },
    
    // ... 13 more characters
  };
  ```
  
  **Fallback logic:**
  ```typescript
  function getRecommendations(character, allAnime, count = 8) {
    const scored = scoreAllAnime(character, allAnime);
    const topMatches = scored.slice(0, count * 2);
    
    // If we don't have enough high-quality matches
    if (topMatches.length < count) {
      // Fallback: Add top-rated anime
      const topRated = allAnime
        .sort((a, b) => b.ratings.site - a.ratings.site)
        .slice(0, count - topMatches.length);
      
      return [...topMatches, ...topRated];
    }
    
    // Randomize and return
    return randomizeTopResults(topMatches, count);
  }
  ```
  
  **Why fallback matters:**
  - Some characters might not have 8 good matches
  - New anime might not fit any character perfectly
  - Ensures we always show 8 recommendations (no empty states)
  
  **Validation process:**
  - Test each character profile with actual anime data
  - Verify recommendations make sense (would this character like this anime?)
  - Get team feedback (especially Mei, our target customer)
  - Iterate on weights if recommendations feel off
  
  **Success criteria:**
  - All 18 characters have complete profiles
  - Category weights sum to 1.0 for each character
  - Preferred genres are relevant to character personality
  - Fallback logic works when needed
  - Recommendations feel personalized and relevant
  
  _Requirements: council-meeting retention_
  _Estimated: 2 hours_
  _Owner: Data Scientist (Priya)_

- [ ] 9. Build recommendations UI component
- [ ] 9.1 Create RecommendationsSection component
  - Design card layout for recommended anime
  - Show anime cover image, title, ratings
  - Add "View Details" and "Add to Watchlist" buttons
  - Implement responsive grid (2 cols mobile, 3-4 cols desktop)
  - _Requirements: council-meeting retention_
  - _Estimated: 3 hours_

- [ ] 9.2 Integrate recommendations into quiz result page
  - Add RecommendationsSection below character result
  - Fetch recommended anime based on character match
  - Add section heading: "Anime Perfect For You"
  - Add CTA to browse all anime
  - _Requirements: council-meeting retention_
  - _Estimated: 1 hour_

- [ ] 10. Add analytics for recommendations
  - Track "recommendations_viewed" event
  - Track "recommendation_clicked" event with anime ID
  - Track conversion from quiz → browse via recommendations
  - Measure click-through rate on recommended anime
  - _Requirements: council-meeting analytics_
  - _Estimated: 1 hour_

## Polish & Testing (Ongoing)

- [ ]* 11. Cross-browser and device testing
  - Test mobile menu fix on iOS Safari, Android Chrome, Firefox Mobile
  - Test shareable cards on various screen sizes
  - Test download functionality on different devices
  - Test social sharing on iOS and Android
  - Verify recommendations display correctly
  - _Requirements: all features_
  - _Estimated: 2 hours_

- [ ]* 12. Performance optimization
  - Optimize image loading for result cards
  - Lazy load recommendations section
  - Minimize bundle size for new components
  - Test page load times on 3G connection
  - _Requirements: all features_
  - _Estimated: 2 hours_

- [ ]* 13. Accessibility audit
  - Ensure keyboard navigation for share buttons
  - Add ARIA labels for screen readers
  - Test color contrast on result cards
  - Verify focus management in mobile menu
  - _Requirements: all features_
  - _Estimated: 1 hour_

## Success Metrics

### Mobile Menu Fix
- Zero user complaints about mobile navigation
- Menu opens/closes smoothly on all devices
- No background scroll when menu is open

### Shareable Result Cards
- 20% share rate on quiz completions (target)
- 50% download rate on result cards
- Viral coefficient > 1.0 within 2 weeks
- Average 3+ shares per day initially

### Personalized Recommendations
- 50% of quiz-takers click on at least one recommendation
- 30% add recommended anime to watchlist
- 20% increase in browse page visits from quiz results

## Timeline Summary

**Day 1:**
- Mobile menu fix (2-3 hours) ✓
- Result card design mockups (4-6 hours) ✓
- Result card component setup (2-3 hours) ✓

**Day 2:**
- Result card visual implementation (4 hours)
- Download functionality (3 hours)
- Social sharing buttons (2 hours)

**Day 3:**
- Web Share API integration (2 hours)
- Quiz result page integration (2 hours)
- Analytics tracking (1 hour)
- Testing and polish (3 hours)

**Day 4:**
- Recommendation algorithm (3 hours)
- Recommendations UI (3 hours)
- Integration and analytics (2 hours)

**Total: 4 days, ~40 hours of focused work**

## Dependencies

1. **Design mockups** must be complete before visual implementation (Day 1 → Day 2)
2. **Character images** must be downloaded before result cards work (prerequisite)
3. **Recommendation algorithm** must be defined before UI implementation (Day 4)
4. **Mobile menu fix** should be deployed before driving traffic via sharing

## Risk Mitigation

**Risk:** Image generation is slow or buggy
**Mitigation:** Test html-to-image library early, have canvas API as backup

**Risk:** Social sharing doesn't work on all platforms
**Mitigation:** Implement fallback to copy link + manual sharing

**Risk:** Recommendation algorithm is too simple
**Mitigation:** Start simple, iterate based on user feedback and data

**Risk:** Timeline is too aggressive
**Mitigation:** Focus on MVP for each feature, polish later based on metrics

## Notes from Technical Team

**Alex (Software Engineer):** "The mobile menu fix is straightforward - we have the pattern from other projects. Shareable cards will be the most complex piece, but html-to-image library should handle it. I'm confident in the 4-day timeline if we stay focused."

**Priya (Data Scientist):** "The recommendation algorithm can start simple - just category matching with weights. We can make it more sophisticated later once we have user interaction data."

**Jordan (UI/UX Designer):** "The result cards need to be Instagram-worthy. I'll create multiple design options and we can A/B test them later. Priority is getting one solid design shipped."

**Sam (Project Manager):** "We're tracking daily progress. If we slip on Day 2, we cut scope on polish, not on core functionality. Shareable cards are non-negotiable."

**David (Director of Tech):** "This is aggressive but doable. The key is parallel work - design and engineering need to stay in sync. We ship the mobile fix today, cards by end of Day 3, recommendations by end of Day 4. Then we measure and iterate."
