import type { MetadataRoute } from 'next';
import { SITE_URL } from '@/lib/site';

const PRIVATE_PATHS = ['/*/admin', '/*/claim'];

// Search and AI assistant crawlers are named explicitly so a future
// blanket rule can't shut them out by accident.
const AI_CRAWLERS = [
  'GPTBot',
  'OAI-SearchBot',
  'ChatGPT-User',
  'ClaudeBot',
  'Claude-SearchBot',
  'Claude-User',
  'PerplexityBot',
  'Google-Extended',
];

export default function robots(): MetadataRoute.Robots {
  return {
    rules: [
      { userAgent: '*', allow: '/', disallow: PRIVATE_PATHS },
      { userAgent: AI_CRAWLERS, allow: '/', disallow: PRIVATE_PATHS },
    ],
    sitemap: `${SITE_URL}/sitemap.xml`,
  };
}
