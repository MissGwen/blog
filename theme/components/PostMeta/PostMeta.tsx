import { useFrontmatter } from '@rspress/core/runtime';
import { normalizeDate, normalizeTags } from '../../utils/posts';
import './PostMeta.css';

/** 文章页标题下的元信息行:日期 + 标签;无 date/tags 的页面不渲染。 */
export default function PostMeta() {
  const { frontmatter } = useFrontmatter();
  const date = normalizeDate(frontmatter.date);
  const tags = normalizeTags(frontmatter.tags);

  if (!date && tags.length === 0) return null;

  return (
    <div className="mg-post-meta">
      {date && <time className="mg-post-meta__date">{date}</time>}
      {tags.map((tag) => (
        <span className="mg-post-tag" key={tag}>
          {tag}
        </span>
      ))}
    </div>
  );
}
