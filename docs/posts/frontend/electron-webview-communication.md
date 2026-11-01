---
title: 关于 Electron webview 通信问题
date: 2025-01-06
tags: [Electron, 前端]
description: Electron webview 与宿主渲染进程、preload 脚本的双向通信实践:preload 与 executeJavaScript 两种注入方式的环境差异,以及用 contextBridge 打通双向通信。
---

简单写了一个 Electron 使用 `webview` 嵌入外部页面的代码:

- `preload`: 预加载脚本的本地路径,必须为 `file` 协议 + 本地绝对路径
- Electron 提供了 webview DOM 的类型为 `Electron.WebviewTag`(可能有一部分小伙伴不知道,随口一提)

```tsx
// App.tsx
import React, { useEffect, useRef } from 'react';

const style = { width: '100%', height: '100vh' };

const App: React.FC = () => {
  const webview = useRef<Electron.WebviewTag>(null);

  const handleDomReady = (): void => {
    const element = webview.current as Electron.WebviewTag;
    element.openDevTools();
  };

  useEffect(() => {
    const element = webview.current;
    element?.addEventListener('dom-ready', handleDomReady);
    return (): void => {
      element?.removeEventListener('dom-ready', handleDomReady);
    };
  }, []);

  return (
    <webview
      ref={webview}
      style={style}
      src="https://example.com/"
      preload="file:///absolute/path/to/preload.cjs"
    />
  );
};

export default App;
```

## Electron 渲染进程 👉 Webview 预加载脚本

在 dom-ready 之后,宿主渲染进程通过 `element.send()` 向 webview 的预加载脚本发送消息:

```tsx
// App.tsx
const App: React.FC = () => {
  ...
  const webview = useRef<Electron.WebviewTag>(null)

  const handleDomReady = (): void => {
    const element = webview.current as Electron.WebviewTag
    element.openDevTools()

    // ✨✨✨
    element.send('to-webview:preload', 'ping')
  }

  ...

  return (
    <webview
      ref={webview}
      style={style}
      src="https://example.com/"
      preload="file:///absolute/path/to/preload.cjs"
    />
  )
}
```

## Webview 预加载脚本 👉 Electron 渲染进程

预加载脚本里用 `ipcRenderer.sendToHost()` 向宿主渲染进程发送消息:

```js
// preload.cjs
const { ipcRenderer } = require('electron');

ipcRenderer.sendToHost('to-electron:render', 'ping');
```

宿主渲染进程监听 webview 的 `ipc-message` 事件:

- 接收的 `event.args` 的值,实际为一个数组,这样就可以传递和接收多个值

```tsx
// App.tsx
const App: React.FC = () => {
  const webview = useRef<Electron.WebviewTag>(null);

  // ✨✨✨
  const handleIpcMessage = (event: Electron.IpcMessageEvent): void => {
    console.log(event.args); // ['ping']
  };

  useEffect(() => {
    const element = webview.current;

    // ✨✨✨
    element?.addEventListener('ipc-message', handleIpcMessage);

    return (): void => {
      element?.removeEventListener('ipc-message', handleIpcMessage);
    };
  }, []);

  return (
    <webview
      ref={webview}
      style={style}
      src="https://example.com/"
      preload="file:///absolute/path/to/preload.cjs"
    />
  );
};
```

## Webview 渲染进程 👈👉 Webview 预加载脚本

Electron 给 webview 提供了两种注入 JavaScript 代码的方式:

1. 就是上面提到的使用 `preload` 脚本
2. 就是使用 `executeJavaScript` 注入

```ts
webview.current?.executeJavaScript(`console.log(window)`);
```

这样注入的 js 就可以在嵌入页面的内部执行。

`executeJavaScript` 只能在 `'dom-ready'` 之后进行调用,注意先后顺序。

但是也随之遇到了一个问题,我们使用 `executeJavaScript` 去访问 `window` 对象,和在 `preload` 文件中去访问 `window` 对象,得到的结果其实并不相同。这说明,虽然都是 `window` 对象,都可以去操作 DOM,都可以在嵌入页面运行,但其实两者的环境是相互独立的!

- **通过 `executeJavaScript` 注入的 js 代码,可以去访问嵌入页面本身在 `window` 上挂载的方法,而无法访问 node api**
- **使用 `preload` 文件注入的 js 代码,可以访问 node api 而无法访问嵌入页面本身在 `window` 上挂载的方法**
- **这个概念相当于 Electron 文档介绍的上下文隔离(context isolation)**

## 如何通信

在 preload 使用 `contextBridge` 向 `window` 中暴露注册处理函数,为了方便双向通信,我们将第二个参数设置为回调:

```js
// preload.cjs
const { contextBridge } = require('electron');

contextBridge.exposeInMainWorld('preload', {
  // 定义自己的处理函数
  doAThing(data, cb) {
    console.log(data, 'preload'); // ping
    cb('pong');
  },
});
```

`executeJavaScript` 环境中,就有了访问 `preload` 的能力,我们使用 `element.executeJavaScript('window.preload.doAThing("ping")')` 调用定义的处理函数:

```tsx
// App.tsx
const App: React.FC = () => {
  const webview = useRef<Electron.WebviewTag>(null);

  const handleDomReady = (): void => {
    const element = webview.current as Electron.WebviewTag;
    element.openDevTools();

    // ✨✨✨
    element.executeJavaScript(`
      window.preload.doAThing('ping', (data) => {
        console.log(data, 'executeJavaScript') // pong
      })
    `);
  };

  useEffect(() => {
    const element = webview.current;
    element?.addEventListener('dom-ready', handleDomReady);
    return (): void => {
      element?.removeEventListener('dom-ready', handleDomReady);
    };
  }, []);

  return (
    <webview
      ref={webview}
      style={style}
      src="https://example.com/"
      preload="file:///absolute/path/to/preload.cjs"
    />
  );
};
```

我们使用 `webview.openDevTools()` 打开嵌入页面的控制台,就可以成功看到输出了,虽然在一个控制台,但是是属于两个环境打印出来的日志:

![webview 控制台中两个环境打印的日志](/images/electron-webview-console.png)

> 本文首发于 B 站专栏[《关于 Electron webview 通信问题》](https://www.bilibili.com/opus/1019229081174016083)。
