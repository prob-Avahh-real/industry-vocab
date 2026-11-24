/**
 * Rank and merge terms from multiple sources.
 * @param {Array<{ word: string, score: number, sources: string[] }>} entries
 * @param {{ limit?: number }} [opts]
 */
export function rankTerms(entries, opts = {}) {
  const limit = opts.limit ?? 100;
  const byWord = new Map();

  for (const e of entries) {
    const w = e.word.toLowerCase();
    const prev = byWord.get(w);
    if (!prev) {
      byWord.set(w, { word: w, score: e.score, sources: [...new Set(e.sources)] });
      continue;
    }
    prev.score += e.score;
    for (const s of e.sources) if (!prev.sources.includes(s)) prev.sources.push(s);
  }

  return [...byWord.values()]
    .sort((a, b) => b.score - a.score || a.word.localeCompare(b.word))
    .slice(0, limit)
    .map((row, i) => ({ rank: i + 1, ...row }));
}

/**
 * @param {string[]} words
 * @param {string} source
 * @param {number} baseScore
 */
export function scoreBatch(words, source, baseScore) {
  return words.map((word, i) => ({
    word: word.toLowerCase(),
    score: baseScore - Math.min(i * 0.05, baseScore * 0.4),
    sources: [source],
  }));
}
