# MCP Inspector Web

MCP Inspector 是一个面向 MCP 调试流程的可视化面板原型。当前版本提供会话连接、工具列表、动态参数表单、工具调用、结果展示、请求日志与 SSE 日志流能力，并通过 Bridge 服务承接后端接口。

## Core Features

1. Session connect / disconnect with visible status and sessionId.
2. Tools catalog loading, search, retry, and empty/error states.
3. Schema-driven parameter form rendering and field validation.
4. Tool execution with requestId, duration, result, and error inspection.
5. SSE log stream with reconnect and requestId filtering.
6. Built-in i18n support for zh-CN and en-US.

## Quick Start

Frontend:

```bash
cd mcp-inspector-web
npm install
npm run dev
```

Bridge:

```bash
cd mcp-inspector-web/bridge
npm install
npm run dev
```

Open:

1. Frontend: http://localhost:3000
2. Bridge health: http://localhost:3001/health

## i18n

1. Use the top-right language switcher to toggle between zh-CN and en-US.
2. UI strings are routed through the i18n dictionary files under src/i18n/messages.
3. Language preference is persisted locally in the browser.

## Project Status

Day1-Day6 MVP slices are implemented:

1. Frontend app shell and state flow.
2. Real bridge session start / stop.
3. Tools list API and catalog rendering.
4. Dynamic schema form and args preview.
5. Tool execution flow and result inspector.
6. SSE log stream and reconnect handling.

## Documentation

1. Install guide: docs/INSTALL.md
2. API reference: docs/API.md
3. Architecture overview: docs/ARCHITECTURE.md
4. Demo script: DEMO_SCRIPT.md
5. Release checklist: CHECKLIST.md
6. Known issues: KNOWN_ISSUES.md
7. V1.1 roadmap: V1.1_ROADMAP.md

## Known Limitations

1. Tool execution is currently mock-based and not connected to a real MCP SDK.
2. Session state is in-memory only.
3. SSE replay is limited to a small recent in-memory queue.
4. Some advanced JSON Schema shapes still fall back to generic JSON entry.

## Contributing

1. Work on the dev branch for feature development.
2. Keep new UI strings in the i18n dictionaries.
3. Validate with frontend and bridge builds before pushing.

## Next

See V1.1_ROADMAP.md for the next iteration: real MCP integration, persistence, richer metrics, and multi-session support.
