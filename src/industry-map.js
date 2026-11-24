/** Map Chinese / alias industry names to canonical English slugs. */
const ALIASES = {
  finance: ['finance', 'financial', 'banking', 'investment', '金融', '银行', '投资', '证券', '保险'],
  healthcare: ['healthcare', 'health care', 'medical', 'medicine', 'hospital', '医疗', '医药', '健康', '医院', '护理'],
  technology: ['technology', 'tech', 'software', 'it', 'computing', '科技', '技术', '软件', '互联网', '计算机'],
  marketing: ['marketing', 'advertising', 'brand', '市场', '营销', '广告', '品牌'],
  legal: ['legal', 'law', 'lawyer', 'attorney', '法律', '律师', '法务'],
  education: ['education', 'teaching', 'academic', '教育', '教学', '学术'],
  manufacturing: ['manufacturing', 'factory', 'production', '制造', '工厂', '生产'],
  logistics: ['logistics', 'supply chain', 'shipping', '物流', '供应链', '运输'],
  hospitality: ['hospitality', 'hotel', 'tourism', 'travel', '酒店', '旅游', '餐饮'],
  energy: ['energy', 'oil', 'gas', 'renewable', '能源', '石油', '电力', '新能源'],
  realestate: ['real estate', 'realestate', 'property', '房地产', '地产', '物业'],
  accounting: ['accounting', 'audit', 'tax', '会计', '审计', '税务'],
  hr: ['hr', 'human resources', 'recruitment', '人力资源', '招聘', '人事'],
  construction: ['construction', 'architecture', 'engineering', '建筑', '工程', '施工'],
  agriculture: ['agriculture', 'farming', 'agri', '农业', '种植', '畜牧'],
  media: ['media', 'journalism', 'entertainment', '传媒', '新闻', '娱乐'],
  retail: ['retail', 'ecommerce', 'e-commerce', '零售', '电商', '商贸'],
  automotive: ['automotive', 'automobile', 'car', '汽车', '车辆', '新能源车'],
  aerospace: ['aerospace', 'aviation', '航空', '航天', '飞机'],
  biotechnology: ['biotechnology', 'biotech', 'pharma', 'pharmaceutical', '生物', '制药', '生物技术'],
};

const LABELS = {
  finance: '金融',
  healthcare: '医疗健康',
  technology: '科技/软件',
  marketing: '市场营销',
  legal: '法律',
  education: '教育',
  manufacturing: '制造业',
  logistics: '物流供应链',
  hospitality: '酒店旅游',
  energy: '能源',
  realestate: '房地产',
  accounting: '会计审计',
  hr: '人力资源',
  construction: '建筑工程',
  agriculture: '农业',
  media: '传媒娱乐',
  retail: '零售电商',
  automotive: '汽车',
  aerospace: '航空航天',
  biotechnology: '生物医药',
};

/**
 * @param {string} input
 * @returns {{ slug: string, label: string, query: string }}
 */
export function resolveIndustry(input) {
  const raw = String(input ?? '').trim();
  if (!raw) throw new Error('请输入行业名称');

  const lower = raw.toLowerCase();
  for (const [slug, aliases] of Object.entries(ALIASES)) {
    if (aliases.some((a) => a.toLowerCase() === lower || raw.includes(a))) {
      return { slug, label: LABELS[slug] ?? slug, query: slug.replace(/([a-z])([A-Z])/g, '$1 $2') };
    }
  }

  const slug = lower.replace(/[^a-z0-9\u4e00-\u9fff]+/g, '-').replace(/^-|-$/g, '') || 'custom';
  return { slug, label: raw, query: raw };
}

export function listIndustries() {
  return Object.entries(LABELS).map(([slug, label]) => ({ slug, label }));
}
