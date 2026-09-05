import './BlogList.css';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { EmptyState } from './EmptyState';
import { PostCard } from './PostCard';

export interface BlogListProps {
  /** 只显示指定分类(slug)的文章;不传则显示全部。 */
  category?: string;
  /** 最多显示篇数;不传则全部显示。 */
  limit?: number;
}

/** 博客文章列表:按日期倒序渲染卡片,空时展示终端引导。可在 MDX 中直接使用。 */
export default function BlogList({ category, limit }: BlogListProps) {
  const posts = useBlogPosts(category);
  const visible = typeof limit === 'number' ? posts.slice(0, limit) : posts;

  if (visible.length === 0) {
    return <EmptyState />;
  }

  return (
    <section className="mg-blog-list">
      {visible.map((post) => (
        <PostCard key={post.routePath} post={post} />
      ))}
    </section>
  );
}
