# API Documentation

## GET /health

Returns bridge health state.

Response:

```json
{ "ok": true }
```

## POST /api/session/start

Starts a session.

Request:

```json
{ "command": "node bridge/dist/index.js" }
```

Success response:

```json
{ "ok": true, "data": { "sessionId": "...", "status": "connected" } }
```

## POST /api/session/stop

Stops a session.

Request:

```json
{ "sessionId": "..." }
```

Success response:

```json
{ "ok": true, "data": { "status": "stopped" } }
```

## GET /api/tools?sessionId=...

Returns the current mock tools list.

Success response:

```json
{ "ok": true, "data": { "tools": [ ... ] } }
```

## POST /api/call

Executes a mock tool call.

Request:

```json
{
  "sessionId": "...",
  "toolName": "search_documents",
  "args": { "query": "hello" },
  "timeoutMs": 30000,
  "requestId": "..."
}
```

Success response:

```json
{
  "ok": true,
  "data": {
    "requestId": "...",
    "ok": true,
    "durationMs": 120,
    "result": { "toolName": "search_documents" }
  }
}
```

## GET /api/events/stream?sessionId=...

SSE stream for request, response, error, system, and heartbeat events.

Event shape:

```json
{
  "type": "request",
  "timestamp": "2026-06-27T00:00:00.000Z",
  "level": "info",
  "requestId": "...",
  "message": "Calling tool search_documents.",
  "payload": {}
}
```
