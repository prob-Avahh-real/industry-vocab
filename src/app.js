import { collectIndustryVocab } from './collect.js';
import { listIndustries } from './industry-map.js';

const $ = (sel) => document.querySelector(sel);
const industryInput = $('#industry');
const collectBtn = $('#collect');
const exportBtn = $('#export');
const statusEl = $('#status');
const metaEl = $('#meta');
const listEl = $('#word-list');
const chipsEl = $('#chips');
const limitEl = $('#limit');
const offlineEl = $('#offline');

let lastResult = null;

function setStatus(text, kind = '') {
  statusEl.textContent = text;
  statusEl.dataset.kind = kind;
}

function renderChips() {
  chipsEl.innerHTML = '';
  for (const { slug, label } of listIndustries().slice(0, 12)) {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'chip';
    btn.textContent = label;
    btn.addEventListener('click', () => {
      industryInput.value = label;
      runCollect();
    });
    chipsEl.appendChild(btn);
  }
}

function renderWords(result) {
  listEl.innerHTML = '';
  if (!result?.words?.length) {
    listEl.innerHTML = '<li class="empty">暂无词汇，请换行业名重试</li>';
    return;
  }

  for (const w of result.words) {
    const li = document.createElement('li');
    li.className = 'word-item';
    li.innerHTML = `
      <span class="rank">${w.rank}</span>
      <span class="term">${w.word}</span>
      <span class="score">${w.score.toFixed(1)}</span>
      <span class="src">${w.sources.join(' · ')}</span>
    `;
    li.addEventListener('click', async () => {
      try {
        await navigator.clipboard.writeText(w.word);
        setStatus(`已复制：${w.word}`, 'ok');
      } catch {
        setStatus(`词条：${w.word}`, 'ok');
      }
    });
    listEl.appendChild(li);
  }
}

async function runCollect() {
  const industry = industryInput.value.trim();
  if (!industry) {
    setStatus('请输入行业名称', 'warn');
    industryInput.focus();
    return;
  }

  collectBtn.disabled = true;
  exportBtn.disabled = true;
  setStatus('收集中…', 'busy');
  metaEl.textContent = '';
  listEl.innerHTML = '<li class="empty loading">正在从种子库、Datamuse、Wikipedia 聚合词汇…</li>';

  try {
    const result = await collectIndustryVocab(industry, {
      limit: Number(limitEl.value) || 80,
      online: !offlineEl.checked,
    });
    lastResult = result;
    metaEl.textContent = `${result.industry.label} · ${result.total} 词 · ${result.online ? '在线' : '离线'}`;
    renderWords(result);
    setStatus('收集完成', 'ok');
    exportBtn.disabled = false;
  } catch (err) {
    setStatus(err.message ?? '收集失败', 'err');
    listEl.innerHTML = '<li class="empty">收集失败</li>';
  } finally {
    collectBtn.disabled = false;
  }
}

function exportWords() {
  if (!lastResult) return;
  const text = lastResult.words.map((w) => w.word).join('\n');
  const blob = new Blob([text], { type: 'text/plain;charset=utf-8' });
  const a = document.createElement('a');
  a.href = URL.createObjectURL(blob);
  a.download = `${lastResult.industry.slug}-vocab.txt`;
  a.click();
  URL.revokeObjectURL(a.href);
  setStatus('已导出词汇表', 'ok');
}

collectBtn.addEventListener('click', runCollect);
exportBtn.addEventListener('click', exportWords);
industryInput.addEventListener('keydown', (e) => {
  if (e.key === 'Enter') runCollect();
});

// Wearable: ring shake → re-collect; cane tap → export
function onWearableGesture(name) {
  if (name === 'shake') runCollect();
  if (name === 'tap') exportWords();
}

if (typeof window !== 'undefined') {
  window.onWearableGesture = onWearableGesture;
}

renderChips();
document.body.classList.add('ready');
setStatus('输入行业名开始收集');
