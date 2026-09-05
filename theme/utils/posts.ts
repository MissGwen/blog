import { BLOG_ROOT, CATEGORIES } from '../constants/site';

/** 从 Rspress 页面数据中提取的最小结构,避免依赖框架内部完整类型。 */
export interface RawPage {
  routePath: string;
  title: string;
  frontmatter?: Record<string, unknown>;
}

export interface Post {
  routePath: string;
  title: string;
  date: string;
  tags: string[];
  category: string;
  description: string;
}

const CATEGORY_SLUGS = new Set(CATEGORIES.map((c) => c.slug));

/** frontmatter 的 date 统一成 `YYYY-MM-DD`;无效值返回空串。列表与文章页共用。 */
export function normalizeDate(value: unknown): string {
  if (!value) return '';
  if (value instanceof Date) return value.toISOString().slice(0, 10);
  if (typeof value === 'number') {
    const d = new Date(value);
    return Number.isNaN(d.getTime()) ? '' : d.toISOString().slice(0, 10);
  }
  return String(value).slice(0, 10);
}

/** tags 支持数组或逗号/空格分隔的字符串。列表与文章页共用。 */
export function normalizeTags(value: unknown): string[] {
  if (Array.isArray(value)) return value.map(String).filter(Boolean);
  if (typeof value === 'string') {
    return value.split(/[,，\s]+/).filter(Boolean);
  }
  return [];
}

function normalizeDescription(value: unknown): string {
  return typeof value === 'string' ? value : '';
}

/** `/blog/rust/hello` → `rust`;分类落地页(单段)返回 null。 */
function inferCategory(routePath: string): string | null {
  const rest = routePath.slice(BLOG_ROOT.length);
  const segments = rest.split('/').filter(Boolean);
  if (segments.length < 2) return null;
  return CATEGORY_SLUGS.has(segments[0]) ? segments[0] : null;
}

function toPost(page: RawPage): Post | null {
  const category = inferCategory(page.routePath);
  if (!category) return null;
  const fm = page.frontmatter ?? {};
  const date = normalizeDate(fm.date);
  if (!date) return null;
  return {
    routePath: page.routePath,
    title: typeof fm.title === 'string' && fm.title ? fm.title : page.title,
    date,
    tags: normalizeTags(fm.tags),
    category,
    description: normalizeDescription(fm.description),
  };
}

/** 收集全部文章;category 存在时按分类过滤;按日期倒序。 */
export function collectPosts(pages: RawPage[], category?: string): Post[] {
  const posts = pages
    .map(toPost)
    .filter((p): p is Post => p !== null)
    .filter((p) => !category || p.category === category)
    .sort((a, b) => b.date.localeCompare(a.date));
  return posts;
}
