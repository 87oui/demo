import alpinejs from '@astrojs/alpinejs'
import react from '@astrojs/react'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'

// https://astro.build/config
export default defineConfig({
  site: 'https://demo.87oui.com',
  server: {
    host: true,
  },
  vite: {
    plugins: [tailwindcss()],
  },
  integrations: [react(), alpinejs()],
})
