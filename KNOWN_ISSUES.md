# Known Issues

1. Tool execution is still backed by mock logic; real MCP SDK integration is not implemented yet.
2. The bridge currently supports a single in-memory session and does not persist state across restarts.
3. SSE reconnection is implemented, but there is no server-side replay gap filling beyond the in-memory recent log queue.
4. The dynamic form currently covers common schema cases; deeply nested custom schema variants may still need a JSON fallback.
5. Release validation items that depend on long-running manual endurance tests are documented but not fully automated.
