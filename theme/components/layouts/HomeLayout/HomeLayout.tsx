import { HomeBackground, Link } from '@rspress/core/theme-original';
import TerminalCard from '../../TerminalCard';
import { useBlogPosts } from '../../../hooks/useBlogPosts';
import {
  CATEGORIES,
  HOME_TERMINAL,
  HOME_TERMINAL_TITLE,
  SITE,
} from '../../../constants/site';
import './HomeLayout.css';

/** SSG-MD(llms.txt)输出:返回纯文本 markdown,便于 AI 抓取。 */
function homeMarkdown(): string {
  const lines = [
    `# ${SITE.name} ${SITE.homeTitle}`,
    '',
    SITE.tagline,
    '',
    `- [进入博客](/posts/)`,
    `- [GitHub](${SITE.github})`,
    '',
    '## 博客分类',
    '',
    ...CATEGORIES.map(
      (c) => `- ${c.emoji} **${c.label}** — ${c.blurb}(${c.path})`,
    ),
    '',
  ];
  return lines.join('\n');
}

/** 首页控制台视图(仅在浏览器/SSG HTML 渲染时挂载)。 */
function HomeConsole() {
  const posts = useBlogPosts();
  const countFor = (slug: string) =>
    posts.filter((p) => p.category === slug).length;

  return (
    <>
      <HomeBackground />
      <main className="mg-home">
        <p className="mg-home__badge">{SITE.badge}</p>
        <h1 className="mg-home__title">
          <span className="mg-home__title-brand">{SITE.name}</span>
          <span className="mg-home__title-sub">{SITE.homeTitle}</span>
        </h1>
        <p className="mg-home__tagline">{SITE.tagline}</p>

        <div className="mg-home__actions">
          <Link className="mg-btn mg-btn--brand" href="/posts/">
            进入博客
          </Link>
          <a
            className="mg-btn mg-btn--alt"
            href={SITE.github}
            target="_blank"
            rel="noreferrer"
          >
            GitHub
          </a>
        </div>

        <div className="mg-home__terminal">
          <TerminalCard
            title={HOME_TERMINAL_TITLE}
            lines={HOME_TERMINAL}
            cursor
          />
        </div>

        <div className="mg-home__dirs">
          {CATEGORIES.map((cat) => (
            <Link key={cat.slug} className="mg-dir-card" href={cat.path}>
              <div className="mg-dir-card__head">
                <span className="mg-dir-card__emoji">{cat.emoji}</span>
                <span className="mg-dir-card__name">{cat.label}</span>
              </div>
              <code className="mg-dir-card__path">~/posts/{cat.slug}</code>
              <p className="mg-dir-card__blurb">{cat.blurb}</p>
              <span className="mg-dir-card__count">
                {countFor(cat.slug)} 篇笔记 →
              </span>
            </Link>
          ))}
        </div>
      </main>
    </>
  );
}

/** 自定义首页:开发者控制台风格(状态徽章 + 终端 + 目录卡片)。 */
export function HomeLayout() {
  if (import.meta.env.SSG_MD) {
    return <>{homeMarkdown()}</>;
  }
  return <HomeConsole />;
}
