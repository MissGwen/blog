# Miss Gwen · dev.log

一个个人技术博客:粉色可爱皮 × 终端硬核骨。
基于 [Rspress 2](https://rspress.rs/) 构建,主题完全自定义(未 eject 内置组件)。

写作方向:全栈开发 + Rust,文章按 `rust` / `frontend` / `backend` 三个分类组织。

## 特性

- 🌸 粉色主题配色(锁定于 `theme/styles/palette.css`,深浅色模式适配)
- ⌨️ 全站命令终端:`Ctrl + `` `(macOS `⌘ + `` `)或右下角 `>_` 按钮唤起,支持命令导航、切换主题、历史记录
- 📝 文章列表自动化:读取文章 frontmatter 的 `date` / `tags` / `description`,按时间倒序渲染
- 🪟 `TerminalCard` 组件:可在任意 MDX 中直接使用的终端风格卡片
- 🧭 终端风 404 页、console 风首页(状态徽章 + 终端窗口 + 分类目录卡片)
- 🧱 严格工程化:TypeScript strict、rslint、prettier、主题代码分层(数据 / 视图 / 样式 / 配置)

## 快速开始

```bash
pnpm install
pnpm dev      # 本地开发
pnpm build    # 生产构建,输出到 doc_build/
pnpm preview  # 本地预览构建产物
```

## 写文章

在 `docs/blog/<分类>/` 下新建 Markdown 文件即可,分类目录:`rust` / `frontend` / `backend`。

```markdown
---
title: 文章标题
date: 2026-09-05
tags: [Rust, 随笔]
description: 一句话摘要,会显示在博客列表卡片上。
---

正文……
```

规则:

- 带 `date` 的页面才会出现在博客列表;`date` 决定排序(倒序)
- `tags` 支持数组或逗号分隔字符串
- 分类由文件所在目录推断,无需在 frontmatter 重复声明
- 终端卡片可直接在正文使用:

````markdown
<TerminalCard title="miss-gwen@blog: ~">

```txt
$ cargo run
Hello, world!
```

</TerminalCard>
````

## 站点终端命令

`Ctrl + `` ` 唤起后可用:

| 命令                | 作用                         |
| ------------------- | ---------------------------- |
| `help`              | 查看所有命令                 |
| `ls` / `posts`      | 列出板块 / 全部文章          |
| `cd <板块>`         | 跳转(rust/frontend/backend…) |
| `open <序号>`       | 打开对应文章                 |
| `theme dark\|light` | 切换深浅色                   |
| `github` / `about`  | 外链 / 关于页                |
| `clear` / `exit`    | 清屏 / 关闭                  |

↑↓ 翻历史,Esc 关闭。

## 目录结构

```
docs/                     # 站点内容(MDX/MD)
├── blog/                 # 文章,按分类目录组织
├── about.mdx             # 关于页
├── index.md              # 首页(pageType: home)
└── public/               # 静态资源(favicon 等,按根路径引用)

theme/                    # 自定义主题(入口 theme/index.tsx)
├── constants/site.ts     # 站点文案/分类/终端内容的单一数据源
├── styles/               # tokens(设计变量)/ palette(配色,锁定)/ global(全局细节)
├── utils/posts.ts        # 文章数据纯函数(frontmatter 规范化/排序/分类推断)
├── hooks/useBlogPosts.ts # 文章数据 hook
└── components/
    ├── TerminalCard/     # 通用终端卡片(MDX 全局组件)
    ├── BlogList/         # 文章列表(卡片/空态)
    ├── SiteTerminal/     # 全站命令终端(globalUIComponents)
    └── layouts/          # HomeLayout(首页)/ NotFoundLayout(404)
```

## 定制入口

| 想改什么         | 去哪里改                                                        |
| ---------------- | --------------------------------------------------------------- |
| 站点名/标语/链接 | `theme/constants/site.ts`                                       |
| 配色             | `theme/styles/palette.css`(粉色配色,勿随意改动)                 |
| 终端文案         | `theme/constants/site.ts`                                       |
| 导航             | `docs/_nav.json`                                                |
| favicon          | 替换 `docs/public/favicon.svg`,改 `rspress.config.ts` 的 `icon` |

## 工程约定

- 主题内一律从 `@rspress/core/theme-original` 导入,避免循环依赖
- 站点级配置集中在 `rspress.config.ts`,不散落页面
- 提交前:`pnpm run lint` + `pnpm exec tsc --noEmit`,格式化交给 `pnpm run format`
