import crypto from "crypto";
import { Router } from "express";
import { AppError, ErrorCodes } from "../errors/errorCodes";
import { logService } from "../services/logService";
import { sessionManager } from "../services/sessionManager";

export const streamRouter = Router();

streamRouter.get("/", (req, res) => {
  const sessionId = typeof req.query.sessionId === "string" ? req.query.sessionId : "";

  if (!sessionId.trim()) {
    res.status(400).json({
      ok: false,
      error: {
        code: ErrorCodes.NOT_CONNECTED,
        message: "sessionId is required.",
      },
    });
    return;
  }

  try {
    sessionManager.assertSession(sessionId);
  } catch (error) {
    if (error instanceof AppError) {
      res.status(error.status).json({
        ok: false,
        error: {
          code: error.code,
          message: error.message,
        },
      });
      return;
    }

    res.status(500).json({
      ok: false,
      error: {
        code: ErrorCodes.INTERNAL,
        message: "Unexpected server error.",
      },
    });
    return;
  }

  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache, no-transform");
  res.setHeader("Connection", "keep-alive");
  res.flushHeaders();

  const clientId = crypto.randomUUID();
  logService.subscribe(sessionId, { id: clientId, res });

  for (const event of logService.getRecentLogs(sessionId)) {
    res.write(`event: log\n`);
    res.write(`data: ${JSON.stringify(event)}\n\n`);
  }

  logService.emitSystem(sessionId, "SSE stream connected.");

  const heartbeatTimer = setInterval(() => {
    logService.emitHeartbeat(sessionId);
  }, 15000);

  req.on("close", () => {
    clearInterval(heartbeatTimer);
    logService.unsubscribe(sessionId, clientId);
    res.end();
  });
});
