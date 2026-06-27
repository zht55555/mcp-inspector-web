# MCP Inspector Web (Day2)

MCP Inspector 的前端 + Bridge 骨架项目。Day2 目标是打通真实会话链路。

## 启动步骤

```bash
npm install
npm run dev
```

浏览器访问：`http://localhost:3000`

Bridge 启动：

```bash
cd bridge
npm install
npm run dev
```

Bridge 健康检查：`http://localhost:3001/health`

## Day1 已完成功能

1. Next.js + TypeScript + Tailwind + src 架构初始化完成。
2. 首页三段布局完成：顶部状态栏、左侧连接/工具区、右侧日志区。
3. Zustand 状态管理已接入。
4. 连接流程支持 `idle -> connecting -> connected`（1 秒伪连接）。
5. 断开流程支持回到 `idle`。
6. 状态变化会写入日志面板并展示时间。
7. 右上角语言下拉切换（zh-CN/en-US）与文案 i18n 化。

## Day2 已完成功能

1. 新增 `bridge` 子项目（Express + TypeScript）。
2. 实现 `POST /api/session/start` 与 `POST /api/session/stop`。
3. 前端连接/断开改为真实接口调用，不再使用 1 秒伪连接。
4. StatusBar 展示真实 `sessionId`。
5. 错误码 `E_CMD_EMPTY`、`E_SESSION_NOT_FOUND` 可在日志中显示。
6. Day2 新增错误文案已接入 i18n 词典。

## Day3 计划

1. 接入 `GET /api/tools`。
2. ToolsCatalog 渲染真实工具目录。
3. 补齐加载态、空态、错误态。
