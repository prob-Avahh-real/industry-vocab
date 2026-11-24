import { STOPWORDS } from './stopwords.js';

const ENGLISH_WORD = /^[a-z][a-z0-9-]*[a-z]$|^[a-z]$/;
const ACRONYM = /^[A-Z]{2,}$/;

/**
 * Extract candidate English terms from free text.
 * @param {string} text
 * @returns {string[]}
 */
export function extractEnglishTerms(text) {
  if (!text) return [];
  const found = new Set();

  for (const m of text.matchAll(/\b[A-Z]{2,}\b/g)) {
    const w = m[0].toLowerCase();
    if (!STOPWORDS.has(w)) found.add(w);
  }

  for (const m of text.matchAll(/\b[a-z][a-z0-9-]*\b/gi)) {
    const raw = m[0];
    const w = raw.toLowerCase();
    if (w.length < 2 || w.length > 32) continue;
    if (STOPWORDS.has(w)) continue;
    if (!ENGLISH_WORD.test(w) && !ACRONYM.test(raw)) continue;
    if (/^\d/.test(w)) continue;
    found.add(w);
  }

  return [...found];
}

/**
 * @param {string} word
 */
export function isValidTerm(word) {
  const w = String(word).toLowerCase().trim();
  if (!w || w.length < 2 || STOPWORDS.has(w)) return false;
  return ENGLISH_WORD.test(w);
}
