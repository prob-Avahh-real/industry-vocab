import { extractEnglishTerms } from '../tokenize.js';

const UA = 'IndustryVocab/1.0 (learning project)';

/**
 * @param {string} query
 * @param {{ max?: number, signal?: AbortSignal }} [opts]
 * @returns {Promise<string[]>}
 */
export async function fetchDatamuseRelated(query, opts = {}) {
  const max = opts.max ?? 80;
  const url = new URL('https://api.datamuse.com/words');
  url.searchParams.set('ml', query);
  url.searchParams.set('max', String(max));

  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: opts.signal });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((row) => String(row.word).toLowerCase()).filter(Boolean);
}

/**
 * Topic-triggered words (words frequently used in contexts about the topic).
 * @param {string} query
 * @param {{ max?: number, signal?: AbortSignal }} [opts]
 */
export async function fetchDatamuseTopics(query, opts = {}) {
  const max = opts.max ?? 60;
  const url = new URL('https://api.datamuse.com/words');
  url.searchParams.set('topics', query);
  url.searchParams.set('max', String(max));

  const res = await fetch(url, { headers: { 'User-Agent': UA }, signal: opts.signal });
  if (!res.ok) return [];
  const data = await res.json();
  return data.map((row) => String(row.word).toLowerCase()).filter(Boolean);
}

/**
 * @param {string} query
 * @param {{ limit?: number, signal?: AbortSignal }} [opts]
 */
export async function fetchWikipediaTerms(query, opts = {}) {
  const limit = opts.limit ?? 5;
  const searchUrl = new URL('https://en.wikipedia.org/w/api.php');
  searchUrl.searchParams.set('action', 'query');
  searchUrl.searchParams.set('list', 'search');
  searchUrl.searchParams.set('srsearch', `${query} industry terminology glossary`);
  searchUrl.searchParams.set('srlimit', String(limit));
  searchUrl.searchParams.set('format', 'json');
  searchUrl.searchParams.set('origin', '*');

  const searchRes = await fetch(searchUrl, { headers: { 'User-Agent': UA }, signal: opts.signal });
  if (!searchRes.ok) return [];
  const searchJson = await searchRes.json();
  const titles = (searchJson.query?.search ?? []).map((s) => s.title).slice(0, limit);
  if (!titles.length) return [];

  const extractUrl = new URL('https://en.wikipedia.org/w/api.php');
  extractUrl.searchParams.set('action', 'query');
  extractUrl.searchParams.set('prop', 'extracts');
  extractUrl.searchParams.set('explaintext', '1');
  extractUrl.searchParams.set('exsectionformat', 'plain');
  extractUrl.searchParams.set('titles', titles.join('|'));
  extractUrl.searchParams.set('format', 'json');
  extractUrl.searchParams.set('origin', '*');

  const extractRes = await fetch(extractUrl, { headers: { 'User-Agent': UA }, signal: opts.signal });
  if (!extractRes.ok) return [];
  const extractJson = await extractRes.json();
  const pages = extractJson.query?.pages ?? {};
  const terms = new Set();
  for (const page of Object.values(pages)) {
    for (const t of extractEnglishTerms(page.extract ?? '')) terms.add(t);
  }
  return [...terms];
}
