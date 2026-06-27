import type { Response } from "express";

export interface StreamLogEvent {
  type: "request" | "response" | "error" | "system" | "heartbeat";
  timestamp: string;
  level: "info" | "error";
  requestId?: string;
  message: string;
  payload?: unknown;
}

type Client = {
  id: string;
  res: Response;
};

class LogService {
  private clients = new Map<string, Client[]>();
  private logs = new Map<string, StreamLogEvent[]>();

  subscribe(sessionId: string, client: Client) {
    const current = this.clients.get(sessionId) ?? [];
    this.clients.set(sessionId, [...current, client]);
  }

  unsubscribe(sessionId: string, clientId: string) {
    const current = this.clients.get(sessionId) ?? [];
    const next = current.filter((client) => client.id !== clientId);
    if (next.length === 0) {
      this.clients.delete(sessionId);
      return;
    }
    this.clients.set(sessionId, next);
  }

  getRecentLogs(sessionId: string) {
    return this.logs.get(sessionId) ?? [];
  }

  emitLog(sessionId: string, event: StreamLogEvent) {
    const queue = this.logs.get(sessionId) ?? [];
    const nextQueue = [...queue, event].slice(-500);
    this.logs.set(sessionId, nextQueue);

    const clients = this.clients.get(sessionId) ?? [];
    for (const client of clients) {
      client.res.write(`event: log\n`);
      client.res.write(`data: ${JSON.stringify(event)}\n\n`);
    }
  }

  emitHeartbeat(sessionId: string) {
    const heartbeat: StreamLogEvent = {
      type: "heartbeat",
      level: "info",
      timestamp: new Date().toISOString(),
      message: "heartbeat",
    };

    const clients = this.clients.get(sessionId) ?? [];
    for (const client of clients) {
      client.res.write(`event: heartbeat\n`);
      client.res.write(`data: ${JSON.stringify(heartbeat)}\n\n`);
    }
  }

  emitRequest(sessionId: string, requestId: string, message: string, payload?: unknown) {
    this.emitLog(sessionId, {
      type: "request",
      level: "info",
      requestId,
      message,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  emitResponse(sessionId: string, requestId: string, message: string, payload?: unknown) {
    this.emitLog(sessionId, {
      type: "response",
      level: "info",
      requestId,
      message,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  emitError(sessionId: string, requestId: string | undefined, message: string, payload?: unknown) {
    this.emitLog(sessionId, {
      type: "error",
      level: "error",
      requestId,
      message,
      payload,
      timestamp: new Date().toISOString(),
    });
  }

  emitSystem(sessionId: string, message: string, payload?: unknown) {
    this.emitLog(sessionId, {
      type: "system",
      level: "info",
      message,
      payload,
      timestamp: new Date().toISOString(),
    });
  }
}

export const logService = new LogService();
