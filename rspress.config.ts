import * as path from 'node:path';
import { defineConfig } from '@rspress/core';

export default defineConfig({
  root: path.join(__dirname, 'docs'),
  lang: 'zh',
  title: 'Miss Gwen · dev.log',
  description:
    '一个全栈开发者的技术笔记:Rust、前端工程、后端与架构 —— 把思考编译成文字,把踩过的坑写成路标。',
  icon: '/favicon.svg',
  logoText: 'impl Rustacean for MissGwen {}',
  markdown: {
    globalComponents: [
      path.join(__dirname, 'theme/components/TerminalCard/TerminalCard.tsx'),
      path.join(__dirname, 'theme/components/BlogList/BlogList.tsx'),
    ],
  },
  globalUIComponents: [
    path.join(__dirname, 'theme/components/SiteTerminal/SiteTerminal.tsx'),
  ],
  themeConfig: {
    socialLinks: [
      {
        icon: 'github',
        mode: 'link',
        content: 'https://github.com/MissGwen',
      },
    ],
  },
});
