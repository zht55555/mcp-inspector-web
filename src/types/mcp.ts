export type ConnectionStatus = "idle" | "connecting" | "connected" | "error";

export interface UiLog {
  id: string;
  timestamp: string;
  level: "info" | "error";
  message: string;
  requestId?: string;
}

export interface ExecutionResultState {
  requestId: string;
  ok: boolean;
  durationMs: number;
  result?: Record<string, unknown>;
  error?: Record<string, unknown>;
  errorCode?: string;
  errorMessage?: string;
}

export interface UiTool {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

export interface McpUiState {
  connectionStatus: ConnectionStatus;
  sessionId: string | null;
  command: string;
  logs: UiLog[];
  lastExecution: ExecutionResultState | null;
  selectedTool: UiTool | null;
  tools: UiTool[];
  toolsLoading: boolean;
  toolsError: string | null;
  streamConnected: boolean;
}
