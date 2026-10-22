import { after } from 'next/server';
import { SITE_URL } from '@/lib/site';

// Public by design: Bing checks it against /<key>.txt in public/.
const INDEXNOW_KEY = '48de803422b9aca588252177e94027b3';

// Tells Bing (and other IndexNow engines) that these URLs changed.
// Production only. Runs after the response, never throws.
export function notifyIndexNow(urls: string[]) {
  if (process.env.VERCEL_ENV !== 'production' || urls.length === 0) return;

  after(async () => {
    try {
      const res = await fetch('https://api.indexnow.org/indexnow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json; charset=utf-8' },
        body: JSON.stringify({
          host: new URL(SITE_URL).host,
          key: INDEXNOW_KEY,
          keyLocation: `${SITE_URL}/${INDEXNOW_KEY}.txt`,
          urlList: urls,
        }),
      });
      if (!res.ok) console.error('[indexnow]', res.status, urls);
    } catch (e) {
      console.error('[indexnow]', e);
    }
  });
}
