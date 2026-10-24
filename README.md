# Tiramisu 3D

Scroll-driven 3D tiramisu built with Three.js and Vite.

## Run it
1. Install Node.js 18 or newer.
2. Unzip, open the folder in VS Code, and open the terminal (Ctrl+`).
3. Run:

    npm install
    npm run dev

4. Open the address it prints (usually http://localhost:5173).

## Build for hosting
    npm run build

The finished site is in the `dist` folder. Upload it to any static host (Netlify, Vercel, GitHub Pages).

## Files
- `index.html` page structure and recipe text cards
- `src/style.css` styling (light and dark mode)
- `src/main.js` the 3D scene and scroll animation

Three.js is pinned to 0.128.0 because the scene was written for that version.
