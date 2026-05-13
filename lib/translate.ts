import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

interface TranslatableContent {
  title: string | null;
  about: string | null;
  highlights: string[] | null;
  buyer_tags: string[] | null;
  strongest_point: string | null;
}

const LANGUAGE_NAMES: Record<string, string> = {
  it: 'Italian',
  pt: 'Portuguese (European)',
};

export async function translateListingContent(
  content: TranslatableContent,
  targetLocale: 'it' | 'pt',
): Promise<TranslatableContent> {
  const fields: Record<string, string | string[]> = {};
  if (content.title) fields.title = content.title;
  if (content.about) fields.about = content.about;
  if (content.highlights?.length) fields.highlights = content.highlights;
  if (content.buyer_tags?.length) fields.buyer_tags = content.buyer_tags;
  if (content.strongest_point) fields.strongest_point = content.strongest_point;

  if (Object.keys(fields).length === 0) return content;

  const language = LANGUAGE_NAMES[targetLocale];

  const message = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2048,
    system: `You are a professional translator for a business acquisition platform serving Italy and Portugal.
Translate business listing content from English to ${language}.
Preserve exact meaning, all numbers, financial terms, and professional tone.
Return ONLY valid JSON with the exact same keys as the input. No explanation, no markdown.`,
    messages: [
      {
        role: 'user',
        content: `Translate this business listing content to ${language}:\n\n${JSON.stringify(fields, null, 2)}`,
      },
    ],
  });

  const raw = message.content[0].type === 'text' ? message.content[0].text.trim() : '';
  const translated = JSON.parse(raw) as Record<string, string | string[]>;

  return {
    title: typeof translated.title === 'string' ? translated.title : content.title,
    about: typeof translated.about === 'string' ? translated.about : content.about,
    highlights: Array.isArray(translated.highlights) ? translated.highlights : content.highlights,
    buyer_tags: Array.isArray(translated.buyer_tags) ? translated.buyer_tags : content.buyer_tags,
    strongest_point: typeof translated.strongest_point === 'string' ? translated.strongest_point : content.strongest_point,
  };
}
