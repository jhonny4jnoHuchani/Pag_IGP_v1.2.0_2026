/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_API_TOKEN: string
  readonly VITE_INSTITUCION_ID: string
  readonly VITE_UPLOADS_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    headers: {
      // ✅ Protección contra Clickjacking
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
      
      // ✅ Prevenir MIME sniffing
      'X-Content-Type-Options': 'nosniff',
      
      // ✅ Protección XSS
      'X-XSS-Protection': '1; mode=block',
    }
  },
  preview: {
    headers: {
      'X-Frame-Options': 'SAMEORIGIN',
      'Content-Security-Policy': "frame-ancestors 'self'",
      'X-Content-Type-Options': 'nosniff',
      'X-XSS-Protection': '1; mode=block',
    }
  }
})