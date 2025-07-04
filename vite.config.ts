/// <reference types="vitest/config" />
/// <reference types="vite/client" />

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
  ],
    test: {
        pool: 'vmForks',
        globals: true,
        environment: 'jsdom',
        css: true,
        server: {
            deps: {
                inline: true,
                fallbackCJS: true,
            }
        }
    },
  server: {
    strictPort: true,
  }
})
