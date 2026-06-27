import { AppError, ErrorCodes } from "../errors/errorCodes";
import { sessionManager } from "./sessionManager";
import type { ToolItem } from "../types/tool";

const mockTools: ToolItem[] = [
  {
    name: "search_documents",
    description: "Search indexed documents by keyword.",
    inputSchema: {
      type: "object",
      required: ["query"],
      properties: {
        query: { type: "string", description: "Search keywords" },
        limit: { type: "number", minimum: 1, maximum: 50 },
      },
    },
  },
  {
    name: "create_ticket",
    description: "Create a support ticket in the issue system.",
    inputSchema: {
      type: "object",
      required: ["title"],
      properties: {
        title: { type: "string" },
        priority: { type: "string", enum: ["low", "normal", "high"] },
      },
    },
  },
  {
    name: "send_notification",
    description: "Send a notification message to a channel.",
    inputSchema: {
      type: "object",
      required: ["channel", "message"],
      properties: {
        channel: { type: "string" },
        message: { type: "string" },
      },
    },
  },
];

class ToolsService {
  getToolsBySession(sessionId: string): ToolItem[] {
    if (!sessionId.trim()) {
      throw new AppError(ErrorCodes.NOT_CONNECTED, "Session is not connected.", 400);
    }

    sessionManager.assertSession(sessionId);

    try {
      return mockTools;
    } catch {
      throw new AppError(ErrorCodes.LIST_TOOLS_FAIL, "Failed to list tools.", 500);
    }
  }
}

export const toolsService = new ToolsService();
