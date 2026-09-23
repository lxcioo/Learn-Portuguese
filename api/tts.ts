import type { IncomingMessage, ServerResponse } from 'http';
import https from 'https';

/**
 * Vercel Serverless Function to proxy Google Translate TTS requests.
 * Provides authentic European Portuguese (pt-PT) audio without CORS or referer blocks,
 * and caches audio responses at Vercel's Edge CDN for maximum speed.
 */
export default function handler(req: any, res: any) {
  // Handle CORS Preflight
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  // Parse query parameters
  const host = req.headers?.host || 'localhost';
  const parsedUrl = new URL(req.url || '', `http://${host}`);
  const q = parsedUrl.searchParams.get('q') || req.query?.q;
  const tl = parsedUrl.searchParams.get('tl') || req.query?.tl || 'pt-PT';

  if (!q || !String(q).trim()) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain; charset=utf-8');
    res.end('Missing "q" parameter');
    return;
  }

  const cleanText = String(q)
    .replace(/[\u{1F600}-\u{1F6FF}]/gu, '')
    .replace(/[*_#]/g, '')
    .trim();

  const googleTtsUrl = `https://translate.google.com/translate_tts?ie=UTF-8&q=${encodeURIComponent(cleanText)}&tl=${encodeURIComponent(String(tl))}&client=tw-ob`;

  https
    .get(
      googleTtsUrl,
      {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': '*/*',
        },
      },
      (googleRes) => {
        const statusCode = googleRes.statusCode || 200;

        if (statusCode >= 400) {
          res.statusCode = statusCode;
          res.setHeader('Content-Type', 'text/plain; charset=utf-8');
          res.end(`Google TTS upstream responded with HTTP ${statusCode}`);
          return;
        }

        res.writeHead(200, {
          'Content-Type': 'audio/mpeg',
          'Cache-Control': 'public, max-age=31536000, s-maxage=31536000, immutable',
          'Access-Control-Allow-Origin': '*',
        });

        googleRes.pipe(res);
      }
    )
    .on('error', (err) => {
      console.error('[api/tts] Error fetching TTS audio:', err);
      res.statusCode = 500;
      res.setHeader('Content-Type', 'text/plain; charset=utf-8');
      res.end(`TTS Proxy Error: ${err.message}`);
    });
}
