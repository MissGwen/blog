import { BLOG_ROOT, CATEGORIES, SITE } from '../../constants/site';
import type { CommandContext, CommandResult, TermLine } from './types';

const out = (text: string): TermLine => ({ variant: 'output', text });
const err = (text: string): TermLine => ({ variant: 'error', text });
const ok = (text: string): TermLine => ({ variant: 'success', text });
const dim = (text: string): TermLine => ({ variant: 'dim', text });

/** 命令说明(help 列表)。 */
const HELP_ROWS: Array<[string, string]> = [
  ['help', '显示所有命令'],
  ['ls', '列出站点板块'],
  ['cd <板块>', '跳转到 rust / frontend / backend / blog / home'],
  ['open <序号>', '按 ls posts 的序号打开文章'],
  ['posts', '列出全部文章(带序号)'],
  ['theme <dark|light>', '切换深色/浅色模式'],
  ['github', '打开 GitHub 主页'],
  ['about', '跳到关于页'],
  ['home', '回到首页'],
  ['clear', '清空终端'],
  ['exit', '关闭终端'],
];

const EMPTY: CommandResult = { lines: [] };

function help(): CommandResult {
  return {
    lines: [
      dim('可用命令:'),
      ...HELP_ROWS.map(([cmd, desc]) => out(`  ${cmd.padEnd(18)} ${desc}`)),
    ],
  };
}

function ls(categories: boolean, ctx: CommandContext): CommandResult {
  if (categories) {
    return {
      lines: [
        out('~/blog'),
        ...CATEGORIES.map((c) =>
          out(`  ${c.emoji}  ${c.slug.padEnd(10)} ${c.blurb}`),
        ),
        dim('  (用 cd <板块> 进入,用 ls posts 看文章)'),
      ],
    };
  }
  if (ctx.posts.length === 0) {
    return { lines: [err('ls: posts/: 还没有文章 (｡•́︿•̀｡)')] };
  }
  return {
    lines: [
      out('~/blog/posts'),
      ...ctx.posts.map((p, i) => out(`  [${i + 1}] ${p.date}  ${p.title}`)),
      dim('  (用 open <序号> 打开)'),
    ],
  };
}

function cd(target: string | undefined): CommandResult {
  if (!target) {
    return { lines: [err('cd: 缺少目标。试试 cd rust / cd blog / cd home')] };
  }
  const t = target.toLowerCase().replace(/\/$/, '');

  if (['home', '~', '/', 'index'].includes(t)) {
    return { lines: [ok('→ 回到首页')], nav: '/', close: true };
  }
  if (['blog', 'posts', 'notes'].includes(t)) {
    return { lines: [ok('→ 进入博客')], nav: BLOG_ROOT, close: true };
  }
  if (['about', 'me'].includes(t)) {
    return { lines: [ok('→ 关于我')], nav: '/about/', close: true };
  }
  const cat = CATEGORIES.find((c) => c.slug === t || c.label === target);
  if (cat) {
    return { lines: [ok(`→ 进入 ${cat.label}`)], nav: cat.path, close: true };
  }
  return {
    lines: [
      err(
        `cd: no such directory: ${target}(可用: rust / frontend / backend / blog / about / home)`,
      ),
    ],
  };
}

function openPost(
  index: string | undefined,
  ctx: CommandContext,
): CommandResult {
  if (ctx.posts.length === 0) {
    return { lines: [err('open: 现在还没有文章可以打开')] };
  }
  const n = Number(index);
  if (!Number.isInteger(n) || n < 1 || n > ctx.posts.length) {
    return {
      lines: [
        err(`open: 请输入 1~${ctx.posts.length} 之间的序号(先运行 posts 查看)`),
      ],
    };
  }
  const post = ctx.posts[n - 1];
  return {
    lines: [ok(`→ 打开:${post.title}`)],
    nav: post.routePath,
    close: true,
  };
}

function theme(mode: string | undefined, ctx: CommandContext): CommandResult {
  if (mode === 'dark' || mode === 'light') {
    return {
      lines: [ok(`主题已切换为 ${mode === 'dark' ? '深色 🌙' : '浅色 ☀️'}`)],
      theme: mode,
    };
  }
  return {
    lines: [
      out(`当前:${ctx.theme === 'dark' ? '深色 🌙' : '浅色 ☀️'}`),
      dim('用法:theme dark 或 theme light'),
    ],
  };
}

function sudo(): CommandResult {
  return {
    lines: [
      err('user is not in the sudoers file.'),
      dim('This incident will be reported. 🦀(才不会)'),
    ],
  };
}

/** 解析一行输入,返回展示内容与副作用。纯函数,便于维护和测试。 */
export function resolveCommand(
  input: string,
  ctx: CommandContext,
): CommandResult {
  const raw = input.trim();
  if (!raw) return EMPTY;

  const [cmd, ...args] = raw.split(/\s+/);
  const arg = args[0];

  switch (cmd.toLowerCase()) {
    case 'help':
    case '?':
      return help();
    case 'ls':
    case 'dir':
      return ls(arg !== 'posts' && arg !== 'post', ctx);
    case 'posts':
      return ls(false, ctx);
    case 'cd':
      return cd(arg);
    case 'open':
    case 'cat':
    case 'go':
      return openPost(arg, ctx);
    case 'about':
      return cd('about');
    case 'home':
      return cd('home');
    case 'blog':
      return cd('blog');
    case 'rust':
    case 'frontend':
    case 'backend':
      return cd(cmd.toLowerCase());
    case 'theme':
    case 'dark':
    case 'light':
      return theme(
        cmd.toLowerCase() === 'theme' ? arg : cmd.toLowerCase(),
        ctx,
      );
    case 'github':
    case 'gh':
      return {
        lines: [ok('→ 打开 GitHub')],
        external: SITE.github,
        close: true,
      };
    case 'clear':
    case 'cls':
      return { clear: true, lines: [] };
    case 'exit':
    case 'quit':
    case 'q':
      return { close: true, lines: [dim('bye ~ ♡')] };
    case 'sudo':
      return sudo();
    case 'whoami':
      return { lines: [out('miss-gwen ◆ 全栈工程师(前端 + 后端 + Rust)')] };
    case 'echo':
      return { lines: [out(args.join(' '))] };
    case 'pwd':
      return { lines: [out('~/blog')] };
    default:
      return {
        lines: [
          err(`command not found: ${cmd}`),
          dim('输入 help 查看所有命令'),
        ],
      };
  }
}

export const TERMINAL_HINT =
  '输入 help 查看命令 · ↑↓ 历史 · Enter 执行 · Esc 关闭';
