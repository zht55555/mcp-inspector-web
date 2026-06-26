export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface UiLog {
  id: string;
  timestamp: string;
  level: "info" | "error";
  message: string;
}

export interface McpUiState {
  connectionStatus: ConnectionStatus;
  sessionId: string | null;
  command: string;
  logs: UiLog[];
}
