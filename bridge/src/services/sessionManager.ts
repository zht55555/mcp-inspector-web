import crypto from "crypto";
import { AppError, ErrorCodes } from "../errors/errorCodes";
import type { SessionInfo, StartSessionData, StopSessionData } from "../types/api";

class SessionManager {
  private session: SessionInfo | null = null;

  startSession(command: string): StartSessionData {
    const trimmedCommand = command.trim();
    if (!trimmedCommand) {
      throw new AppError(ErrorCodes.CMD_EMPTY, "Command is required.", 400);
    }

    this.session = {
      sessionId: crypto.randomUUID(),
      status: "connected",
      command: trimmedCommand,
      startedAt: new Date().toISOString(),
    };

    return {
      sessionId: this.session.sessionId,
      status: this.session.status,
    };
  }

  stopSession(sessionId: string): StopSessionData {
    if (!this.session || this.session.sessionId !== sessionId) {
      throw new AppError(ErrorCodes.SESSION_NOT_FOUND, "Session not found.", 404);
    }

    this.session = null;
    return { status: "stopped" };
  }
}

export const sessionManager = new SessionManager();
