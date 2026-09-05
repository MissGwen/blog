import { Link } from '@rspress/core/theme-original';
import TerminalCard from '../TerminalCard';
import {
  BLOG_ROOT,
  EMPTY_TERMINAL,
  EMPTY_TERMINAL_TITLE,
} from '../../constants/site';

/** 博客列表为空时的终端引导卡片。 */
export function EmptyState() {
  return (
    <section className="mg-blog-list">
      <TerminalCard
        title={EMPTY_TERMINAL_TITLE}
        lines={EMPTY_TERMINAL}
        cursor
      />
      <Link className="mg-empty-cta" href={BLOG_ROOT}>
        <span className="mg-empty-cta__arrow" aria-hidden="true">
          →
        </span>
        先逛逛三个分类
      </Link>
    </section>
  );
}
