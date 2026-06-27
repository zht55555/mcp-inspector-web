import { create } from "zustand";
import type { ConnectionStatus, McpUiState, UiLog } from "@/types/mcp";

interface McpActions {
  setCommand: (command: string) => void;
  setConnecting: (message: string) => void;
  setConnected: (sessionId: string, message: string) => void;
  setError: (message: string) => void;
  resetSession: (message: string) => void;
  addLog: (level: UiLog["level"], message: string) => void;
}

type McpStore = McpUiState & McpActions;

const createLog = (level: UiLog["level"], message: string): UiLog => ({
  id: crypto.randomUUID(),
  timestamp: new Date().toISOString(),
  level,
  message,
});

export const useMcpStore = create<McpStore>((set) => ({
  connectionStatus: "idle",
  sessionId: null,
  command: "",
  logs: [],

  setCommand: (command) => {
    set({ command });
  },

  addLog: (level, message) => {
    set((state) => ({
      logs: [...state.logs, createLog(level, message)],
    }));
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
    }));
  },
}));
