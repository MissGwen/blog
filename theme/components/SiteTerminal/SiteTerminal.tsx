import { ThemeContext, useNavigate } from '@rspress/core/runtime';
import {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type FormEvent,
  type KeyboardEvent,
} from 'react';
import { useBlogPosts } from '../../hooks/useBlogPosts';
import { resolveCommand, TERMINAL_HINT } from './commands';
import type { TermLine, TermTheme } from './types';
import './SiteTerminal.css';

/** Rspress ThemeContext 未导出精确类型,这里按实际结构约束。 */
interface ThemeContextValue {
  theme?: string;
  setTheme?: (theme: string) => void;
}

const BOOT_LINES: TermLine[] = [
  { variant: 'dim', text: 'Miss Gwen 的站点终端 · 输入 help 开始' },
  { variant: 'dim', text: TERMINAL_HINT },
];

/** 全站命令终端:Ctrl/Cmd+`(反引号)唤起,支持导航 / 切主题 / 历史命令。 */
export default function SiteTerminal() {
  const [open, setOpen] = useState(false);
  const [history, setHistory] = useState<string[]>([]);
  const [lines, setLines] = useState<TermLine[]>(BOOT_LINES);
  const [value, setValue] = useState('');
  const [histIndex, setHistIndex] = useState(-1);

  const posts = useBlogPosts();
  const navigate = useNavigate();
  const themeCtx = useContext(ThemeContext) as ThemeContextValue | null;

  const inputRef = useRef<HTMLInputElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);

  const currentTheme: TermTheme = themeCtx?.theme === 'dark' ? 'dark' : 'light';

  const run = useCallback(
    (raw: string) => {
      const input = raw.trim();
      if (!input) {
        setLines((prev) => [...prev, { variant: 'command', text: '$' }]);
        return;
      }

      const echoed: TermLine = { variant: 'command', text: `$ ${input}` };
      const result = resolveCommand(input, { posts, theme: currentTheme });

      if (result.clear) {
        setLines(BOOT_LINES);
      } else {
        setLines((prev) => [...prev, echoed, ...result.lines]);
      }
      if (result.close) {
        setOpen(false);
      }
      if (result.theme) {
        themeCtx?.setTheme?.(result.theme);
      }
      if (result.external) {
        window.open(result.external, '_blank', 'noreferrer');
      }
      if (result.nav) {
        navigate(result.nav);
      }

      setHistory((h) => [...h, input]);
      setHistIndex(-1);
    },
    [posts, currentTheme, themeCtx, navigate],
  );

  // 全局快捷键:Ctrl/Cmd+`(反引号,同 VS Code 终端)开关,Esc 关闭
  useEffect(() => {
    const onKey = (e: globalThis.KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === '`') {
        e.preventDefault();
        setOpen((o) => !o);
      } else if (e.key === 'Escape') {
        setOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  // 打开时聚焦输入;有新输出时滚到底部
  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);
  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [lines, open]);

  const onSubmit = (e: FormEvent) => {
    e.preventDefault();
    run(value);
    setValue('');
  };

  const onKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'ArrowUp') {
      e.preventDefault();
      if (history.length === 0) return;
      const idx =
        histIndex === -1 ? history.length - 1 : Math.max(0, histIndex - 1);
      setHistIndex(idx);
      setValue(history[idx]);
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      if (histIndex === -1) return;
      const idx = histIndex + 1;
      if (idx >= history.length) {
        setHistIndex(-1);
        setValue('');
      } else {
        setHistIndex(idx);
        setValue(history[idx]);
      }
    }
  };

  return (
    <>
      <button
        type="button"
        className="mg-term-launcher"
        onClick={() => setOpen(true)}
        aria-label="打开站点终端"
        title="打开站点终端 (Ctrl/⌘+`)"
      >
        <span className="mg-term-launcher__prompt">&gt;_</span>
      </button>

      {open && (
        <div
          className="mg-term-overlay"
          onClick={() => setOpen(false)}
          role="dialog"
          aria-modal="true"
          aria-label="站点终端"
        >
          <div className="mg-term-panel" onClick={(e) => e.stopPropagation()}>
            <div className="mg-term-panel__bar">
              <span className="mg-term-dot mg-term-dot--red" />
              <span className="mg-term-dot mg-term-dot--yellow" />
              <span className="mg-term-dot mg-term-dot--green" />
              <span className="mg-term-panel__title">
                miss-gwen@blog: ~ — 输入 help
              </span>
            </div>

            <div className="mg-term-panel__body" ref={bodyRef}>
              {lines.map((line, i) => (
                <p
                  key={i}
                  className={`mg-term-out mg-term-out--${line.variant}`}
                >
                  {line.text}
                </p>
              ))}
              <form className="mg-term-input-row" onSubmit={onSubmit}>
                <span className="mg-term-input-row__prompt" aria-hidden="true">
                  $
                </span>
                <input
                  ref={inputRef}
                  className="mg-term-input-row__field"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  onKeyDown={onKeyDown}
                  spellCheck={false}
                  autoComplete="off"
                  aria-label="终端命令输入"
                />
              </form>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
