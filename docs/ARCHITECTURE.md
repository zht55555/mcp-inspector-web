# Architecture

## Frontend

1. Next.js App Router application.
2. Zustand store manages session state, tools state, result state, and log stream state.
3. i18n provider controls zh-CN / en-US switching and string lookup.
4. ToolsCatalog drives tool selection and mounts the dynamic form and result inspector.
5. LogPanel consumes both local and SSE-delivered log events.

## Bridge

1. Express server exposes session, tools, call, and stream endpoints.
2. SessionManager keeps a single in-memory active session.
3. ToolsService returns mock tools data.
4. CallService simulates success, failure, and timeout paths.
5. LogService fans out SSE events per session and keeps a small in-memory recent log queue.

## Data Flow

1. Frontend starts a session through /api/session/start.
2. Frontend requests tools through /api/tools.
3. Frontend renders a schema-based parameter form.
4. Frontend calls /api/call with sessionId, toolName, args, timeoutMs, and requestId.
5. Bridge emits request/response/error events to /api/events/stream.
6. Frontend updates the result panel and log panel from execution and stream state.
