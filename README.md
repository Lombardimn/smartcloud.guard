# SmartCloud Guard - Progressive Web App

This is a [Next.js](https://nextjs.org) Progressive Web Application (PWA) bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app) and enhanced with PWA capabilities.

## PWA Features

This application is a fully functional Progressive Web App with the following features:

### ✅ Installable
- Can be installed on mobile devices (Android/iOS) and desktop (Windows/macOS/Linux)
- Provides an app-like experience when installed
- Appears in the app drawer/home screen

### ✅ Offline Support
- Works offline with cached content
- Custom offline fallback page
- Service worker for intelligent caching

### ✅ Optimized Caching Strategies
- **Google Fonts**: Cache First (365 days)
- **Images**: Cache First (30 days)
- **Static Resources (JS/CSS)**: Stale While Revalidate (24 hours)
- **API Responses**: Network First with 10s timeout (24 hours)
- **Pages**: Network First with 10s timeout (24 hours)

### ✅ Complete Manifest
- Multiple icon sizes (72x72 to 512x512)
- Maskable icons for Android adaptive icons
- Apple touch icons for iOS
- Standalone display mode for native app experience

### ✅ SEO & Social Sharing
- Open Graph tags for social media sharing
- Twitter Card support
- Comprehensive metadata for search engines

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

## Building for Production

To build the application for production:

```bash
npm run build
```

**Note**: The build uses webpack (via `--webpack` flag) because the PWA plugin requires it. Next.js 16 uses Turbopack by default, but PWA plugins currently work only with webpack.

To start the production server:

```bash
npm start
```

## PWA Configuration

The PWA configuration is located in `next.config.ts` using [@ducanh2912/next-pwa](https://github.com/DuCanhGH/next-pwa).

### Key Configuration Points:

- **Service Worker**: Auto-generated at `/sw.js`
- **Offline Fallback**: Custom page at `/offline.html`
- **PWA Disabled in Development**: For easier debugging
- **Manifest**: Located at `/public/manifest.json`

## Testing PWA Features

### Desktop (Chrome/Edge)
1. Build and start the production server
2. Open Chrome DevTools > Application tab
3. Check "Manifest" section for manifest validation
4. Check "Service Workers" section to verify registration
5. Use Lighthouse to run PWA audit

### Mobile Testing
1. Deploy to a server with HTTPS (required for PWA)
2. Open in mobile browser (Chrome/Safari)
3. Look for "Add to Home Screen" or "Install App" prompt
4. Install and test offline functionality

### Lighthouse PWA Audit
Run Lighthouse audit to verify PWA compliance:
- Open Chrome DevTools
- Go to Lighthouse tab
- Select "Progressive Web App" category
- Click "Generate report"

## Project Structure

```
/public
  /icons/              # PWA icons in multiple sizes
    - icon-72x72.png
    - icon-96x96.png
    - icon-128x128.png
    - icon-144x144.png
    - icon-152x152.png
    - icon-192x192.png
    - icon-384x384.png
    - icon-512x512.png
    - icon-512x512-maskable.png
    - apple-touch-icon.png
  - manifest.json      # Web app manifest
  - offline.html       # Offline fallback page
  - sw.js             # Service worker (auto-generated)

/app
  - layout.tsx        # Root layout with PWA metadata
  - page.tsx          # Home page

next.config.ts        # Next.js + PWA configuration
```

## Learn More

To learn more about the technologies used:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API
- [PWA Documentation](https://web.dev/progressive-web-apps/) - learn about Progressive Web Apps
- [next-pwa](https://github.com/DuCanhGH/next-pwa) - the PWA plugin used in this project
- [Workbox](https://developers.google.com/web/tools/workbox) - service worker library

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

**Important**: Ensure your deployment uses HTTPS, as service workers require a secure context.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
