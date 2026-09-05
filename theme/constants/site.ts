import type { TerminalLineData } from '../components/TerminalCard/types';

/** 站点级文案与链接的单一数据源。 */
export const SITE = {
  name: 'Miss Gwen',
  homeTitle: '~/dev.log',
  badge: '● blog 运行中 · 持续更新',
  tagline: '全栈开发 / Rust 🦀 —— 把思考编译成文字,把踩过的坑写成路标 ♡',
  github: 'https://github.com/MissGwen',
} as const;

export const BLOG_ROOT = '/blog/';

export interface Category {
  slug: string;
  label: string;
  emoji: string;
  path: string;
  blurb: string;
}

/** 博客分类;文章 frontmatter 的 category 需与 slug 对应。 */
export const CATEGORIES: Category[] = [
  {
    slug: 'rust',
    label: 'Rust',
    emoji: '🦀',
    path: '/blog/rust/',
    blurb: '所有权、异步、CLI 与工具链',
  },
  {
    slug: 'frontend',
    label: '前端',
    emoji: '🎨',
    path: '/blog/frontend/',
    blurb: '工程化、框架、性能与体验',
  },
  {
    slug: 'backend',
    label: '后端',
    emoji: '⚙️',
    path: '/blog/backend/',
    blurb: '服务、架构、数据库与部署',
  },
];

export const HOME_TERMINAL_TITLE = 'miss-gwen@blog: ~/notes';
export const HOME_TERMINAL: TerminalLineData[] = [
  { kind: 'command', text: 'whoami' },
  { kind: 'output', text: 'miss-gwen ◆ 全栈工程师(前端 + 后端 + Rust)' },
  { kind: 'command', text: 'ls ~/notes' },
  { kind: 'output', text: 'rust/    frontend/    backend/' },
  { kind: 'command', text: 'rustc --version' },
  { kind: 'output', text: 'rustc 1.8x · 正在用 Rust 重写一切(不是)' },
  { kind: 'command', text: 'cat now.md' },
  { kind: 'output', text: '最近:写代码 🦀 · 运动 🏃 · 记录 ✍' },
];

export const EMPTY_TERMINAL_TITLE = '~/blog — empty';
export const EMPTY_TERMINAL: TerminalLineData[] = [
  { kind: 'command', text: 'ls posts/' },
  { kind: 'output', text: 'ls: posts/: 内容还是空的 (｡•́︿•̀｡)' },
  { kind: 'command', text: 'echo 写文章中…' },
  { kind: 'output', text: '正在努力生产内容 ✦' },
];

export const NOT_FOUND_TERMINAL_TITLE = 'miss-gwen@blog: ~';
export const NOT_FOUND_TERMINAL: TerminalLineData[] = [
  { kind: 'command', text: 'cd /the/page/you/wanted' },
  { kind: 'output', text: 'cd: no such file or directory (404)' },
  { kind: 'command', text: 'echo 回到安全的地方吧 →' },
  { kind: 'output', text: '这个页面不存在,或者已经搬家啦' },
];
