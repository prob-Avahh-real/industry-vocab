#!/usr/bin/env node
import { collectIndustryVocab, formatAsJson, formatAsText } from '../src/collect.js';
import { listIndustries } from '../src/industry-map.js';

const args = process.argv.slice(2);

function usage() {
  console.log(`行业英语词汇收集器

用法:
  npm run collect -- <行业名> [--json] [--offline] [--limit N]
  npm run collect -- --list

示例:
  npm run collect -- 金融
  npm run collect -- finance --limit 50
  npm run collect -- healthcare --json
`);
}

if (args.includes('--help') || args.includes('-h')) {
  usage();
  process.exit(0);
}

if (args.includes('--list')) {
  for (const { slug, label } of listIndustries()) {
    console.log(`${label.padEnd(12)}  (${slug})`);
  }
  process.exit(0);
}

const industry = args.find((a) => !a.startsWith('--'));
if (!industry) {
  usage();
  process.exit(1);
}

const asJson = args.includes('--json');
const offline = args.includes('--offline');
const limitIdx = args.indexOf('--limit');
const limit = limitIdx >= 0 ? Number(args[limitIdx + 1]) : 80;

try {
  const result = await collectIndustryVocab(industry, { limit, online: !offline });
  console.log(asJson ? formatAsJson(result) : formatAsText(result));
} catch (err) {
  console.error('Error:', err.message ?? err);
  process.exit(1);
}
