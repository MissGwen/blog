import type { Post } from '../../utils/posts';

export type TermTheme = 'dark' | 'light';

/** 终端输出的一行;variant 决定配色与是否带提示符。 */
export interface TermLine {
  variant: 'command' | 'output' | 'error' | 'success' | 'dim';
  text: string;
}

/** 命令解析结果:展示的行 + 可选副作用(导航 / 切主题 / 清屏 / 关闭)。 */
export interface CommandResult {
  lines: TermLine[];
  nav?: string;
  external?: string;
  theme?: TermTheme;
  clear?: boolean;
  close?: boolean;
}

export interface CommandContext {
  posts: Post[];
  theme: TermTheme;
}
