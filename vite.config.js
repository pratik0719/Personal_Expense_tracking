import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import tailwindcss from '@tailwindcss/vite'
import { VitePWA } from 'vite-plugin-pwa'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),

    /**
     * Progressive Web App:
     * - A Workbox service worker precaches the whole app (HTML, JS, CSS,
     *   fonts, icons), so it opens and runs with no internet connection.
     * - Page navigations fall back to the cached index.html (SPA routes work offline).
     * - The manifest makes the app installable on phones ("Add to Home screen").
     * - registerType "prompt": when a new version is deployed, the app shows
     *   an "Update available" banner instead of reloading under the user.
     */
    VitePWA({
      registerType: 'prompt',
      includeAssets: ['favicon.ico', 'apple-touch-icon-180x180.png'],
      manifest: {
        name: 'ExpenseFlow — Personal Finance',
        short_name: 'ExpenseFlow',
        description: 'Track income, expenses, budgets and loans — even offline.',
        lang: 'en',
        start_url: '/',
        scope: '/',
        display: 'standalone',
        orientation: 'portrait',
        theme_color: '#06060d',
        background_color: '#06060d',
        icons: [
          { src: 'pwa-64x64.png', sizes: '64x64', type: 'image/png' },
          { src: 'pwa-192x192.png', sizes: '192x192', type: 'image/png' },
          { src: 'pwa-512x512.png', sizes: '512x512', type: 'image/png' },
          { src: 'maskable-icon-512x512.png', sizes: '512x512', type: 'image/png', purpose: 'maskable' },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2,webmanifest}'],
        globIgnores: [
          // The 1.6 MB source logo is only used by the README; the app uses small generated copies.
          'logo.png',
          // Font subsets for scripts the app doesn't use; browsers fetch them only if ever needed.
          '**/*-cyrillic*',
          '**/*-greek*',
          '**/*-vietnamese*',
        ],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        maximumFileSizeToCacheInBytes: 4 * 1024 * 1024,
      },
    }),
  ],
})
