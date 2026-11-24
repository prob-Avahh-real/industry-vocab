import { describe, it } from 'node:test';
import assert from 'node:assert/strict';
import { resolveIndustry, listIndustries } from '../src/industry-map.js';
import { getSeedTerms } from '../src/seeds.js';
import { extractEnglishTerms, isValidTerm } from '../src/tokenize.js';
import { rankTerms, scoreBatch } from '../src/rank.js';
import { collectIndustryVocab } from '../src/collect.js';

describe('resolveIndustry', () => {
  it('maps Chinese finance input', () => {
    const r = resolveIndustry('金融');
    assert.equal(r.slug, 'finance');
    assert.equal(r.label, '金融');
  });

  it('maps English healthcare input', () => {
    const r = resolveIndustry('healthcare');
    assert.equal(r.slug, 'healthcare');
  });

  it('falls back to slugified query for unknown industry', () => {
    const r = resolveIndustry('quantum gardening');
    assert.equal(r.slug, 'quantum-gardening');
    assert.equal(r.query, 'quantum gardening');
  });

  it('lists known industries', () => {
    assert.ok(listIndustries().length >= 10);
  });
});

describe('tokenize', () => {
  it('extracts English terms from mixed text', () => {
    const terms = extractEnglishTerms('The EBITDA margin and ROI improved in Q4 reporting.');
    assert.ok(terms.includes('ebitda'));
    assert.ok(terms.includes('roi'));
    assert.ok(!terms.includes('the'));
  });

  it('validates terms', () => {
    assert.equal(isValidTerm('portfolio'), true);
    assert.equal(isValidTerm('the'), false);
    assert.equal(isValidTerm('a'), false);
  });
});

describe('rank', () => {
  it('merges duplicate words and sums scores', () => {
    const ranked = rankTerms([
      { word: 'equity', score: 5, sources: ['seed'] },
      { word: 'equity', score: 3, sources: ['wiki'] },
      { word: 'bond', score: 4, sources: ['seed'] },
    ]);
    assert.equal(ranked[0].word, 'equity');
    assert.equal(ranked[0].score, 8);
    assert.deepEqual(ranked[0].sources.sort(), ['seed', 'wiki']);
  });

  it('scoreBatch preserves order weighting', () => {
    const batch = scoreBatch(['alpha', 'beta'], 'seed', 10);
    assert.ok(batch[0].score > batch[1].score);
  });
});

describe('seeds', () => {
  it('returns finance seed terms offline', () => {
    const seeds = getSeedTerms('finance');
    assert.ok(seeds.length >= 30);
    assert.ok(seeds.includes('portfolio'));
  });
});

describe('collectIndustryVocab offline', () => {
  it('collects ranked words from seeds only', async () => {
    const result = await collectIndustryVocab('金融', { online: false, limit: 20 });
    assert.equal(result.industry.slug, 'finance');
    assert.ok(result.words.length > 0);
    assert.ok(result.words.every((w) => w.sources.includes('seed')));
    assert.equal(result.words[0].rank, 1);
  });
});
