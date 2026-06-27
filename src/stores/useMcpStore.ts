import { create } from "zustand";
import { BridgeClientError, getTools } from "@/lib/bridgeClient";
import type { ConnectionStatus, McpUiState, UiLog } from "@/types/mcp";

interface McpActions {
  setCommand: (command: string) => void;
  setConnecting: (message: string) => void;
  setConnected: (sessionId: string, message: string) => void;
  setError: (message: string) => void;
  resetSession: (message: string) => void;
  addLog: (level: UiLog["level"], message: string, requestId?: string) => void;
  setSelectedTool: (tool: McpUiState["selectedTool"]) => void;
  setTools: (tools: McpUiState["tools"]) => void;
  setToolsLoading: (loading: boolean) => void;
  setToolsError: (errorCode: string | null) => void;
  setLastExecution: (execution: McpUiState["lastExecution"]) => void;
  fetchTools: (sessionId: string) => Promise<void>;
}

type McpStore = McpUiState & McpActions;

const createLog = (level: UiLog["level"], message: string, requestId?: string): UiLog => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  level,
  message,
  requestId,
});

export const useMcpStore = create<McpStore>((set) => ({
  connectionStatus: "idle",
  sessionId: null,
  command: "",
  logs: [],
  lastExecution: null,
  selectedTool: null,
  tools: [],
  toolsLoading: false,
  toolsError: null,

  setCommand: (command) => {
    set({ command });
  },

  addLog: (level, message, requestId) => {
    set((state) => ({
      logs: [...state.logs, createLog(level, message, requestId)],
    }));
  },

  setLastExecution: (execution) => {
    set({ lastExecution: execution });
  },

  setSelectedTool: (tool) => {
    set({ selectedTool: tool });
  },

  setTools: (tools) => {
    set({ tools });
  },

  setToolsLoading: (loading) => {
    set({ toolsLoading: loading });
  },

  setToolsError: (errorCode) => {
    set({ toolsError: errorCode });
  },

  fetchTools: async (sessionId) => {
    set({ toolsLoading: true, toolsError: null });

    try {
      const data = await getTools(sessionId);
      set({
        tools: data.tools,
        toolsError: null,
        selectedTool: data.tools[0] ?? null,
      });
    } catch (error) {
      const errorCode = error instanceof BridgeClientError ? error.code : "E_UNKNOWN";
      set({ toolsError: errorCode, tools: [], selectedTool: null });
    } finally {
      set({ toolsLoading: false });
    }
  },

  setConnecting: (message) => {
    set((state) => ({
      connectionStatus: "connecting",
      logs: [...state.logs, createLog("info", message)],
    }));
  },

  setConnected: (sessionId, message) => {
    set((state) => ({
      connectionStatus: "connected",
      sessionId,
      logs: [...state.logs, createLog("info", message)],
    }));
  },

  setError: (message) => {
    set((state) => ({
      connectionStatus: "error",
      logs: [...state.logs, createLog("error", message)],
    }));
  },

  resetSession: (message) => {
    set((state) => ({
      connectionStatus: "idle",
      sessionId: null,
      logs: [...state.logs, createLog("info", message)],
      lastExecution: null,
      selectedTool: null,
      tools: [],
      toolsLoading: false,
      toolsError: null,
    }));
  },
}));
