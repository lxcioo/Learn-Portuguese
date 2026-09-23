const RAW_WEBHOOK_URL =
  (typeof (globalThis as any).process !== 'undefined' ? (globalThis as any).process.env?.EXPO_PUBLIC_DISCORD_WEBHOOK_URL : undefined) ||
  ((import.meta as any)?.env?.VITE_DISCORD_WEBHOOK_URL as string | undefined);

/**
 * Resolves the effective webhook endpoint:
 * In browsers, if pointing directly to https://discord.com/api/webhooks/...,
 * route through local /api/discord-webhook proxy to avoid CORS restrictions.
 */
function getEffectiveWebhookUrl(): string | undefined {
  if (!RAW_WEBHOOK_URL) return undefined;
  if (RAW_WEBHOOK_URL.startsWith('https://discord.com/api/webhooks/')) {
    return RAW_WEBHOOK_URL.replace('https://discord.com/api/webhooks', '/api/discord-webhook');
  }
  return RAW_WEBHOOK_URL;
}

export const DiscordService = {
  async sendCrashReport(error: Error): Promise<boolean> {
    const url = getEffectiveWebhookUrl();
    if (!url) {
      console.warn('[DiscordService] No webhook URL configured for crash reporting');
      return false;
    }

    const discordMessage = `**🚨 APP ABSTURZ ABGEFANGEN 🚨**\n**Gerät:** Web / PWA\n\n**Fehlermeldung:**\n> ${error.message}\n\n**Stacktrace:**\n\`\`\`javascript\n${error.stack ? error.stack.substring(0, 1000) : 'Kein Stacktrace'}\n\`\`\``;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: discordMessage }),
      });
      return response.ok;
    } catch (e) {
      console.warn('[DiscordService] Proxy/fetch crash report error:', e);
      // Fallback with no-cors if proxy wasn't reached
      try {
        if (RAW_WEBHOOK_URL) {
          await fetch(RAW_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ content: discordMessage }),
          });
          return true;
        }
      } catch {
        // Silently handle
      }
      return false;
    }
  },

  async sendFeedback(senderName: string, feedback: string): Promise<boolean> {
    const url = getEffectiveWebhookUrl();
    if (!url) {
      console.log('Feedback logged locally (no webhook configured):', senderName, feedback);
      return true;
    }

    const discordMessage = `**💡 Neues Feedback**\n**Von:** ${senderName}\n**Gerät:** Web / PWA\n\n**Nachricht:**\n> ${feedback}`;

    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content: discordMessage }),
      });
      return response.ok;
    } catch (e) {
      console.warn('[DiscordService] Proxy feedback error, attempting direct fallback:', e);
      try {
        if (RAW_WEBHOOK_URL) {
          await fetch(RAW_WEBHOOK_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'text/plain' },
            body: JSON.stringify({ content: discordMessage }),
          });
          return true;
        }
      } catch (directErr) {
        console.error('[DiscordService] Feedback delivery failed:', directErr);
      }
      return false;
    }
  },
};

