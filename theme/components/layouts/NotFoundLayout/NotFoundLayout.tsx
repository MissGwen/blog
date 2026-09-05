import { Link } from '@rspress/core/theme-original';
import TerminalCard from '../../TerminalCard';
import {
  NOT_FOUND_TERMINAL,
  NOT_FOUND_TERMINAL_TITLE,
} from '../../../constants/site';
import './NotFoundLayout.css';

/** 终端风 404:命令行提示页面不存在,引导回首页。 */
export function NotFoundLayout() {
  return (
    <main className="mg-404">
      <h1 className="mg-404__code">404</h1>
      <div className="mg-404__terminal">
        <TerminalCard
          title={NOT_FOUND_TERMINAL_TITLE}
          lines={NOT_FOUND_TERMINAL}
          cursor
        />
      </div>
      <Link className="mg-btn mg-btn--brand mg-404__btn" href="/">
        cd ~ 回首页
      </Link>
    </main>
  );
}
