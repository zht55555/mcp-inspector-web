# MCP Inspector Demo Script

## Demo Goal

Use 3 minutes to show the full MCP Inspector MVP flow:
connect -> list tools -> generate form -> execute tool -> inspect logs.

## 0-30s: Product Intro

1. MCP Inspector turns MCP debugging from terminal-only output into a visual workflow.
2. The MVP focuses on session lifecycle, tools list, dynamic forms, execution tracing, and log visibility.
3. The UI supports zh-CN and en-US via the top-right language switcher.

## 30-60s: Connect Session

1. Enter a bridge command in the Connection panel.
2. Click Connect.
3. Show the status transition in the StatusBar.
4. Confirm a real sessionId appears.

## 60-100s: Explore Tools

1. Show the auto-loaded tools list.
2. Use the search box to filter tools by keyword.
3. Click a tool card and point out the schema field count.

## 100-140s: Dynamic Form

1. Show the generated parameter form.
2. Trigger one validation error intentionally.
3. Fix the input and show the args preview updating in real time.
4. Copy the preview once to demonstrate the workflow.

## 140-170s: Execute Tool

1. Click Execute.
2. Show requestId, duration, success state, and JSON result in ResultInspector.
3. Mention that failure and timeout are also normalized as structured results.

## 170-180s: Logs and Close

1. Show requestId filtering in LogPanel.
2. Mention SSE log streaming and reconnect support.
3. Close with Day7 release readiness and v1.1 roadmap direction.
