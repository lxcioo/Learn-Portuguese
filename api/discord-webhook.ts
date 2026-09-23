import https from 'https';

/**
 * Vercel Serverless Function to proxy Discord Webhook calls to avoid browser CORS restrictions.
 */
export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    res.statusCode = 204;
    res.end();
    return;
  }

  if (req.method !== 'POST') {
    res.statusCode = 405;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Method Not Allowed');
    return;
  }

  const webhookPath = req.url?.replace(/^\/api\/discord-webhook\/?/, '') || '';
  if (!webhookPath) {
    res.statusCode = 400;
    res.setHeader('Content-Type', 'text/plain');
    res.end('Missing webhook path');
    return;
  }

  const targetUrl = `https://discord.com/api/webhooks/${webhookPath}`;

  const bodyData = typeof req.body === 'string' ? req.body : JSON.stringify(req.body);

  const parsed = new URL(targetUrl);
  const options = {
    hostname: parsed.hostname,
    path: parsed.pathname + parsed.search,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(bodyData),
    },
  };

  const proxyReq = https.request(options, (proxyRes) => {
    res.statusCode = proxyRes.statusCode || 200;
    proxyRes.pipe(res);
  });

  proxyReq.on('error', (err) => {
    console.error('[discord-webhook] Proxy error:', err);
    res.statusCode = 500;
    res.end('Webhook delivery failed');
  });

  proxyReq.write(bodyData);
  proxyReq.end();
}
