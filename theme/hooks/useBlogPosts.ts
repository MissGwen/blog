import { usePages } from '@rspress/core/runtime';
import { useMemo } from 'react';
import type { Post } from '../utils/posts';
import { collectPosts } from '../utils/posts';

/**
 * 读取全部 Rspress 页面并规范化为博客文章。
 * @param category 可选分类 slug,传入时只返回该分类下的文章。
 */
export function useBlogPosts(category?: string): Post[] {
  const { pages } = usePages();
  return useMemo(() => collectPosts(pages, category), [pages, category]);
}
