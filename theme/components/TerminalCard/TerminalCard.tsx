import './TerminalCard.css';
import type { TerminalCardProps, TerminalLineData } from './types';

function Line({ line }: { line: TerminalLineData }) {
  return (
    <p
      className={
        line.kind === 'command'
          ? 'mg-term__line'
          : 'mg-term__line mg-term__line--output'
      }
    >
      {line.kind === 'command' && (
        <span className="mg-term__prompt" aria-hidden="true">
          $
        </span>
      )}
      {line.text}
    </p>
  );
}

/** 终端风格卡片:用于首页、博客空态、404、关于页,也可在 MDX 中直接使用。 */
export default function TerminalCard({
  title,
  lines,
  children,
  cursor = false,
}: TerminalCardProps) {
  return (
    <div className="mg-term">
      <div className="mg-term__bar">
        <span className="mg-term__dot mg-term__dot--red" />
        <span className="mg-term__dot mg-term__dot--yellow" />
        <span className="mg-term__dot mg-term__dot--green" />
        {title && <span className="mg-term__title">{title}</span>}
      </div>
      <div className="mg-term__body">
        {lines
          ? lines.map((line, i) => <Line key={i} line={line} />)
          : children}
        {cursor && (
          <p className="mg-term__line mg-term__line--cursor">
            <span className="mg-term__prompt" aria-hidden="true">
              $
            </span>
            <span className="mg-term__blink" aria-hidden="true">
              ▋
            </span>
          </p>
        )}
      </div>
    </div>
  );
}
