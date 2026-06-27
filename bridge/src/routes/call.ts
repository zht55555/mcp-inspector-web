import { Router } from "express";
import { z } from "zod";
import { AppError, ErrorCodes } from "../errors/errorCodes";
import { callService } from "../services/callService";
import { sendError, sendSuccess } from "../utils/response";

const callSchema = z.object({
  sessionId: z.string().min(1),
  toolName: z.string().min(1),
  args: z.record(z.string(), z.unknown()),
  timeoutMs: z.number().int().positive().max(30000).optional(),
  requestId: z.string().optional(),
});

export const callRouter = Router();

callRouter.post("/", async (req, res) => {
  const parsed = callSchema.safeParse(req.body);
  if (!parsed.success) {
    return sendError(
      res,
      {
        code: ErrorCodes.VALIDATION,
        message: "Invalid call request.",
        details: parsed.error.flatten(),
      },
      400,
    );
  }

  try {
    const data = await callService.executeToolCall(parsed.data);
    return sendSuccess(res, data, 200);
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, { code: error.code, message: error.message, details: error.details }, error.status);
    }

    return sendError(res, { code: ErrorCodes.INTERNAL, message: "Unexpected server error." }, 500);
  }
});
