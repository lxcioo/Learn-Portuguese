import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';
import { VitePWA } from 'vite-plugin-pwa';
import path from 'path';
import https from 'https';

export default defineConfig({
  base: process.env.BASE_URL || '/',
  plugins: [
    react(),
    tailwindcss(),
    {
      name: 'google-translate-tts-proxy',
      configureServer(server) {
        server.middlewares.use('/api/tts', (req: any, res: any) => {
          const url = new URL(req.url || '', 'http://localhost');
          const q = url.searchParams.get('q');
          const tl = url.searchParams.get('tl') || 'pt-PT';
          if (!q) {
            res.statusCode = 400;
            res.end('Missing q');
            return;
          }
          const ttsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(q)}&tl=${tl}&client=tw-ob`;
          https
            .get(ttsUrl, { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' } }, (ttsRes: any) => {
              res.writeHead(ttsRes.statusCode || 200, {
                'Content-Type': 'audio/mpeg',
                'Cache-Control': 'public, max-age=604800, immutable',
                'Access-Control-Allow-Origin': '*',
              });
              ttsRes.pipe(res);
            })
            .on('error', (err: any) => {
              res.statusCode = 500;
              res.end(err.message);
            });
        });
      },
    },
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['icon.svg', 'apple-touch-icon.png', 'pwa-192x192.png', 'pwa-512x512.png'],
      manifest: {
        id: '/',
        name: 'Learn Portuguese - Imersão & Diálogos',
        short_name: 'Português',
        description: 'Learn authentic Portuguese through real dialogues, natural sentence chunks, and spaced repetition. 100% offline.',
        theme_color: '#059669',
        background_color: '#f8fafc',
        display: 'standalone',
        orientation: 'portrait-primary',
        start_url: '/',
        scope: '/',
        icons: [
          {
            src: '/pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any',
          },
          {
            src: '/pwa-maskable-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff,woff2,json}'],
        navigateFallback: 'index.html',
        cleanupOutdatedCaches: true,
        runtimeCaching: [
          {
            urlPattern: ({ request, url }) =>
              url.pathname.startsWith('/audio/') ||
              url.pathname.endsWith('.mp3') ||
              url.pathname.startsWith('/api/tts') ||
              url.hostname.includes('translate.google.com'),
            handler: 'CacheFirst',
            options: {
              cacheName: 'audio-cache-v2-pt-pt',
              expiration: {
                maxEntries: 3000,
                maxAgeSeconds: 60 * 60 * 24 * 365, // 1 year
              },
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: ({ url }) => url.pathname === '/content.json',
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'content-cache-v1',
              cacheableResponse: {
                statuses: [0, 200],
              },
            },
          },
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: {
                maxEntries: 10,
                maxAgeSeconds: 60 * 60 * 24 * 365,
              },
            },
          },
        ],
      },
      devOptions: {
        enabled: true,
        type: 'module',
      },
    }),
  ],
  resolve: {
    alias: {
      '@': path.resolve(import.meta.dirname, '.'),
      'src': path.resolve(import.meta.dirname, 'src'),
    },
  },
  server: {
    host: '0.0.0.0',
    port: 3000,
    allowedHosts: true,
    proxy: {
      '/api/discord-webhook': {
        target: 'https://discord.com/api/webhooks',
        changeOrigin: true,
        rewrite: (p) => p.replace(/^\/api\/discord-webhook/, ''),
      },
    },
  },
});

