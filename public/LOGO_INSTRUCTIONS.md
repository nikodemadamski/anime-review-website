# How to Add Your Custom Logo

## Quick Steps:

1. **Prepare your logo image:**
   - Recommended size: 512x512px or larger (square)
   - Format: PNG with transparent background (preferred) or JPG
   - Name it: `logo.png` or `logo.svg`

2. **Add to project:**
   - Place your logo file in the `public` folder
   - Path: `anime-review-website/public/logo.png`

3. **Update the code:**
   
   Replace the placeholder logo in these files:

   **In `src/app/page.tsx` (line ~13):**
   ```tsx
   {/* Replace this: */}
   <div className="w-20 h-20 bg-gradient-to-br from-blue-600 to-purple-600 rounded-3xl flex items-center justify-center shadow-2xl">
     <span className="text-4xl font-bold text-white">A</span>
   </div>

   {/* With this: */}
   <Image 
     src="/logo.png" 
     alt="Anime Review Logo" 
     width={80} 
     height={80}
     className="rounded-3xl shadow-2xl"
   />
   ```

   **In `src/components/layout/Header.tsx` (line ~18):**
   ```tsx
   {/* Replace this: */}
   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
     <span className="text-white font-bold text-lg">A</span>
   </div>

   {/* With this: */}
   <Image 
     src="/logo.png" 
     alt="Logo" 
     width={40} 
     height={40}
     className="rounded-xl shadow-lg"
   />
   ```

   **In `src/components/layout/Footer.tsx` (line ~13):**
   ```tsx
   {/* Replace this: */}
   <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg">
     <span className="text-white font-bold text-lg">A</span>
   </div>

   {/* With this: */}
   <Image 
     src="/logo.png" 
     alt="Logo" 
     width={40} 
     height={40}
     className="rounded-xl shadow-lg"
   />
   ```

4. **Don't forget to import Image:**
   Add this at the top of each file if not already present:
   ```tsx
   import Image from 'next/image';
   ```

## Current Placeholder:
The current "A" letter in a gradient box is a placeholder. It will be automatically replaced once you add your logo image and update the code as shown above.

## Tips:
- Use SVG format for best quality at all sizes
- Keep the logo simple and recognizable
- Ensure good contrast with both light and dark backgrounds
- Test on both desktop and mobile views