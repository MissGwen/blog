import type { ReactNode } from 'react';

/** 终端窗口中的一行:命令行(带粉色 $ 提示符)或输出行(暗色文字)。 */
export interface TerminalLineData {
  kind: 'command' | 'output';
  text: ReactNode;
}

export interface TerminalCardProps {
  /** 标题栏文字,显示在三色圆点右侧,例如 `miss-gwen@blog: ~/notes`。 */
  title?: string;
  /** 结构化命令行内容;不传时渲染 children(MDX 用法)。 */
  lines?: TerminalLineData[];
  /** MDX 自由内容,与 lines 二选一。 */
  children?: ReactNode;
  /** 末尾是否显示闪烁光标。 */
  cursor?: boolean;
}
