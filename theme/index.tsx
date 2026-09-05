// 主题入口:样式注入 + 透传原主题 + 具名覆盖(具名导出优先于 wildcard)。
// 注意:theme/ 内部一律从 @rspress/core/theme-original 导入,避免循环依赖。
import '@fontsource-variable/jetbrains-mono';
import './styles/tokens.css';
import './styles/palette.css';
import './styles/global.css';

import { FallbackHeading as DefaultFallbackHeading } from '@rspress/core/theme-original';
import PostMeta from './components/PostMeta/PostMeta';

export * from '@rspress/core/theme-original';

export { HomeLayout } from './components/layouts/HomeLayout/HomeLayout';
export { NotFoundLayout } from './components/layouts/NotFoundLayout/NotFoundLayout';

interface FallbackHeadingProps {
  level: 1 | 2 | 3 | 4 | 5 | 6;
  title: string;
}

/** 文章标题渲染钩子:标题下方追加日期/标签元信息行(无 date/tags 的页面自渲染为空)。 */
export function FallbackHeading(props: FallbackHeadingProps) {
  const heading = <DefaultFallbackHeading {...props} />;
  if (import.meta.env.SSG_MD) return heading;
  return (
    <>
      {heading}
      <PostMeta />
    </>
  );
}
