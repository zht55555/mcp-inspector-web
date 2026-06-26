# MCP Inspector Web (Day1)

MCP Inspector 的前端骨架项目。Day1 目标是完成页面结构、状态流转与伪连接演示。

## 启动步骤

```bash
npm install
npm run dev
```

浏览器访问：`http://localhost:3000`

## Day1 已完成功能

1. Next.js + TypeScript + Tailwind + src 架构初始化完成。
2. 首页三段布局完成：顶部状态栏、左侧连接/工具区、右侧日志区。
3. Zustand 状态管理已接入。
4. 连接流程支持 `idle -> connecting -> connected`（1 秒伪连接）。
5. 断开流程支持回到 `idle`。
6. 状态变化会写入日志面板并展示时间。

## Day2 计划

1. 接入真实 Bridge 接口。
2. 实现 `POST /api/session/start` 与 `POST /api/session/stop`。
3. 用真实接口替换 Day1 的 1 秒伪连接。
