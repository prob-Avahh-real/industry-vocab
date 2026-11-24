import { resolveIndustry } from './industry-map.js';
import { getSeedTerms } from './seeds.js';
import { fetchDatamuseRelated, fetchDatamuseTopics, fetchWikipediaTerms } from './sources/remote.js';
import { rankTerms, scoreBatch } from './rank.js';
import { isValidTerm } from './tokenize.js';

/**
 * Collect high-frequency English terms for an industry.
 * @param {string} industryInput
 * @param {{ limit?: number, online?: boolean, signal?: AbortSignal }} [opts]
 */
export async function collectIndustryVocab(industryInput, opts = {}) {
  const limit = opts.limit ?? 80;
  const online = opts.online !== false;
  const { slug, label, query } = resolveIndustry(industryInput);

  const entries = [];
  const seeds = getSeedTerms(slug);
  entries.push(...scoreBatch(seeds, 'seed', 12));

  if (online) {
    const [related, topics, wiki] = await Promise.all([
      fetchDatamuseRelated(query, { signal: opts.signal }).catch(() => []),
      fetchDatamuseTopics(query, { signal: opts.signal }).catch(() => []),
      fetchWikipediaTerms(query, { signal: opts.signal }).catch(() => []),
    ]);
    entries.push(...scoreBatch(related, 'datamuse-related', 8));
    entries.push(...scoreBatch(topics, 'datamuse-topics', 7));
    entries.push(...scoreBatch(wiki, 'wikipedia', 6));
  }

  const ranked = rankTerms(
    entries.filter((e) => isValidTerm(e.word)),
    { limit },
  );

  return {
    industry: { input: industryInput, slug, label, query },
    collectedAt: new Date().toISOString(),
    online,
    total: ranked.length,
    words: ranked,
  };
}

/**
 * @param {Awaited<ReturnType<typeof collectIndustryVocab>>} result
 */
export function formatAsText(result) {
  const lines = [
    `# ${result.industry.label} — Industry English Vocabulary`,
    `Query: ${result.industry.query} | Words: ${result.total}`,
    '',
  ];
  for (const w of result.words) {
    lines.push(`${String(w.rank).padStart(3)}. ${w.word}  [${w.sources.join(', ')}]  score:${w.score.toFixed(1)}`);
  }
  return lines.join('\n');
}

/**
 * @param {Awaited<ReturnType<typeof collectIndustryVocab>>} result
 */
export function formatAsJson(result) {
  return JSON.stringify(result, null, 2);
}
