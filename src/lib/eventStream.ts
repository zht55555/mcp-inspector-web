export interface StreamEvent {
  type: "request" | "response" | "error" | "system" | "heartbeat";
  timestamp: string;
  level: "info" | "error";
  requestId?: string;
  message: string;
  payload?: unknown;
}

const BRIDGE_BASE_URL = process.env.NEXT_PUBLIC_BRIDGE_URL ?? "http://localhost:3001";

export function subscribeToEvents(
  sessionId: string,
  onEvent: (event: StreamEvent) => void,
  onConnectionChange?: (connected: boolean) => void,
) {
  let eventSource: EventSource | null = null;
  let heartbeatTimer: ReturnType<typeof setTimeout> | null = null;
  let reconnectTimer: ReturnType<typeof setTimeout> | null = null;
  let closed = false;

  const resetHeartbeat = () => {
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer);
    }

    heartbeatTimer = setTimeout(() => {
      onConnectionChange?.(false);
      eventSource?.close();
      if (!closed) {
        scheduleReconnect();
      }
    }, 20000);
  };

  const scheduleReconnect = () => {
    if (reconnectTimer || closed) {
      return;
    }

    reconnectTimer = setTimeout(() => {
      reconnectTimer = null;
      connect();
    }, 3000);
  };

  const connect = () => {
    onConnectionChange?.(false);
    eventSource = new EventSource(`${BRIDGE_BASE_URL}/api/events/stream?sessionId=${encodeURIComponent(sessionId)}`);

    eventSource.addEventListener("log", (rawEvent) => {
      const messageEvent = rawEvent as MessageEvent;
      const parsed = JSON.parse(messageEvent.data) as StreamEvent;
      onEvent(parsed);
      onConnectionChange?.(true);
      resetHeartbeat();
    });

    eventSource.addEventListener("heartbeat", (rawEvent) => {
      const messageEvent = rawEvent as MessageEvent;
      const parsed = JSON.parse(messageEvent.data) as StreamEvent;
      onEvent(parsed);
      onConnectionChange?.(true);
      resetHeartbeat();
    });

    eventSource.onerror = () => {
      onConnectionChange?.(false);
      eventSource?.close();
      scheduleReconnect();
    };
  };

  connect();

  return () => {
    closed = true;
    if (heartbeatTimer) {
      clearTimeout(heartbeatTimer);
    }
    if (reconnectTimer) {
      clearTimeout(reconnectTimer);
    }
    eventSource?.close();
  };
}
