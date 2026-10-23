# Tiramisu — Three.js + GSAP ScrollTrigger

A Vite project that renders a procedural 3D tiramisu scene in Three.js and uses GSAP ScrollTrigger to sequence the ingredient layers as the user scrolls.

## Run locally
1. Install Node.js 20.19+ (or a current supported Node version).
2. In this folder, run:
   ```bash
   npm install
   npm run dev
   ```
3. Open the local URL printed by Vite.

## Build for hosting
```bash
npm run build
npm run preview
```
Upload the generated `dist/` folder to a static host such as Netlify or Vercel.

## Notes
- The 3D dish, biscuits, cream and cocoa are generated procedurally in Three.js; no external `.glb` assets are required.
- This is a starter artefact: the scene uses stylized procedural geometry with rounded, silky mousse-like cream bubbles; it is still a stylized real-time model rather than photogrammetry or a Blender-sculpted photorealistic model.
- Fonts are loaded from Google Fonts; Three.js and GSAP are installed from npm.


### Interaction and art direction update
- Drag horizontally on the 3D canvas to rotate the dessert; momentum carries the rotation after release.
- Scroll through the six build steps to progressively zoom closer and reveal the two biscuit/cream layers and final cocoa cap.
- RoundedBoxGeometry gives ladyfingers a softly baked, rounded-rectangle shape instead of a capsule/hotdog silhouette.
- Cream materials use a smoother, glossier clearcoat for a soft, pliable mousse-like finish.


### Latest polish
- Text is layered above the canvas and uses a subtle floating animation.
- Cocoa is rendered as fine scattered particles and a light airborne dust cloud rather than a solid slab.
- Cream uses a smooth elastic easing on reveal with a subtle ongoing buoyant bounce.


### Masterclass realism pass
- Replaced separate cream blobs with continuous mascarpone surfaces featuring restrained waves and subtle spatula trails.
- Tuned cream toward a moist, softly whipped finish rather than a rubbery glossy material.
- Kept cocoa as a fine particle dusting positioned directly over the final cream surface.
- Added full-stage drag orbit with 360-degree rotation, vertical tilt, inertial spin, and wheel-based zoom.
- Layer reveals use smooth easing and only a barely perceptible buoyant motion.


### Final presentation pass
- Removed autonomous back-and-forth rotation; the dessert stays still unless the user directly rotates it.
- Scroll progression now focuses on a controlled push-in, with a return to the wider view at the intro/ingredient list.
- Replaced left-side text cards with lightweight floating typography over the scene, using a restrained vertical hover.


## Deploy to Vercel
This project is configured for Vercel with `vercel.json`.

**Option A — Git (recommended)**
1. Unzip the project and push the folder contents to a GitHub/GitLab/Bitbucket repository.
2. In Vercel, choose **Add New → Project** and import that repository.
3. Vercel detects Vite. Confirm build command `npm run build` and output directory `dist`.
4. Click **Deploy**. No environment variables are required.

**Option B — Vercel CLI**
1. Install Node.js 20.19+.
2. In the project folder, run `npm install`.
3. Run `npm run build` to test the production bundle.
4. Run `npx vercel` and follow the prompts; use `npx vercel --prod` for production deployment.

## Responsive behavior
- Mobile-first viewport sizing uses `svh`/`dvh`, safe-area insets and fluid type sizing.
- Small-screen layouts reduce heading sizes, constrain copy width and collapse the ingredients list to one column.
- Touch scrolling is preserved; horizontal touch gestures rotate the dessert while vertical gestures scroll the page.
- Desktop supports drag rotation, scroll-step zoom and wheel zoom.
- Reduced-motion preferences disable decorative CSS animation.
