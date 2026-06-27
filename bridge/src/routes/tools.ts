import { Router } from "express";
import { AppError, ErrorCodes } from "../errors/errorCodes";
import { toolsService } from "../services/toolsService";
import { sendError, sendSuccess } from "../utils/response";

export const toolsRouter = Router();

toolsRouter.get("/", (req, res) => {
  const sessionId = typeof req.query.sessionId === "string" ? req.query.sessionId : "";

  if (!sessionId.trim()) {
    return sendError(
      res,
      {
        code: ErrorCodes.NOT_CONNECTED,
        message: "sessionId is required.",
      },
      400,
    );
  }

  try {
    const tools = toolsService.getToolsBySession(sessionId);
    return sendSuccess(res, { tools });
  } catch (error) {
    if (error instanceof AppError) {
      return sendError(res, { code: error.code, message: error.message, details: error.details }, error.status);
    }

    return sendError(res, { code: ErrorCodes.LIST_TOOLS_FAIL, message: "Failed to list tools." }, 500);
  }
});
