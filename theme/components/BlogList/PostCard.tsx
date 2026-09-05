import { Link } from '@rspress/core/theme-original';
import type { Post } from '../../utils/posts';

interface PostCardProps {
  post: Post;
}

/** 单篇文章卡片:日期 + 标签 + 标题 + 摘要。 */
export function PostCard({ post }: PostCardProps) {
  return (
    <article className="mg-post-card">
      <div className="mg-post-card__meta">
        <time className="mg-post-card__date">{post.date}</time>
        {post.tags.map((tag) => (
          <span className="mg-post-tag" key={tag}>
            {tag}
          </span>
        ))}
      </div>
      <Link className="mg-post-card__title" href={post.routePath}>
        {post.title}
      </Link>
      {post.description && (
        <p className="mg-post-card__desc">{post.description}</p>
      )}
    </article>
  );
}
