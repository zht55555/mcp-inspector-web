import crypto from "crypto";
import { AppError, ErrorCodes } from "../errors/errorCodes";
import { logService } from "./logService";
import { sessionManager } from "./sessionManager";
import type { CallRequestInput, CallSuccessData } from "../types/call";

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

class CallService {
  async executeToolCall(input: CallRequestInput): Promise<CallSuccessData> {
    const { sessionId, toolName, args, timeoutMs = 30000 } = input;

    sessionManager.assertSession(sessionId);

    if (!toolName.trim()) {
      throw new AppError(ErrorCodes.VALIDATION, "Tool name is required.", 400);
    }

    const requestId = input.requestId ?? crypto.randomUUID();
    const startedAt = Date.now();
    const simulatedDelayMs = typeof args.simulatedDelayMs === "number" ? args.simulatedDelayMs : 120;

    logService.emitRequest(sessionId, requestId, `Calling tool ${toolName}.`, {
      toolName,
      args,
      timeoutMs,
    });

    if (typeof args.fail === "boolean" && args.fail) {
      logService.emitError(sessionId, requestId, `Tool ${toolName} failed.`, { toolName, args });
      throw new AppError(ErrorCodes.CALL_FAILED, "Mock tool execution failed.", 500, { requestId });
    }

    if (simulatedDelayMs > timeoutMs) {
      await delay(timeoutMs);
      logService.emitError(sessionId, requestId, `Tool ${toolName} timed out.`, { toolName, timeoutMs });
      throw new AppError(ErrorCodes.TIMEOUT, "Tool execution timed out.", 408, { requestId });
    }

    await delay(simulatedDelayMs);

    const result = {
      toolName,
      echoedArgs: args,
      message: "Mock tool executed successfully.",
    };

    logService.emitResponse(sessionId, requestId, `Tool ${toolName} completed.`, result);

    return {
      requestId,
      ok: true,
      durationMs: Date.now() - startedAt,
      result,
    };
  }
}

export const callService = new CallService();
