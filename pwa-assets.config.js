import { defineConfig, minimal2023Preset } from '@vite-pwa/assets-generator/config'

// Generates the favicon, home-screen and install icons from the app logo:
//   npx pwa-assets-generator
// Black padding matches the logo's own background.
export default defineConfig({
  preset: {
    ...minimal2023Preset,
    maskable: { ...minimal2023Preset.maskable, resizeOptions: { background: '#000000' } },
    apple: { ...minimal2023Preset.apple, resizeOptions: { background: '#000000' } },
  },
  images: ['public/New_logo.jpg'],
})
