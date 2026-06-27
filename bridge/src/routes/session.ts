import { Router } from "express";
import { z } from "zod";
import { AppError, ErrorCodes } from "../errors/errorCodes";
import { sessionManager } from "../services/sessionManager";
import { sendError, sendSuccess } from "../utils/response";

const startSessionSchema = z.object({
  command: z.string(),
  workspacePath: z.string().optional(),
  envVars: z.record(z.string(), z.string()).optional(),
});

const stopSessionSchema = z.object({
  sessionId: z.string().min(1),
});

export const sessionRouter = Router();

sessionRouter.post("/start", (req, res) => {
  const parsed = startSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(
      res,
      {
        code: ErrorCodes.BAD_REQUEST,
        message: "Invalid request body.",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  try {
    const data = sessionManager.startSession(parsed.data.command);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, { code: error.code, message: error.message, details: error.details }, error.status);
    }
    return sendError(res, { code: ErrorCodes.INTERNAL, message: "Unexpected server error." }, 500);
  }
});

sessionRouter.post("/stop", (req, res) => {
  const parsed = stopSessionSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(
      res,
      {
        code: ErrorCodes.BAD_REQUEST,
        message: "Invalid request body.",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  try {
    const data = sessionManager.stopSession(parsed.data.sessionId);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, { code: error.code, message: error.message, details: error.details }, error.status);
    }
    return sendError(res, { code: ErrorCodes.INTERNAL, message: "Unexpected server error." }, 500);
  }
});
