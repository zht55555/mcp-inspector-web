import type { Response } from "express";

export function sendSuccess<T>(res: Response, data: T, status = 200) {
  return res.status(status).json({
    ok: true,
    data,
  });
}

export function sendError(
  res: Response,
  error: { code: string; message: string; details?: unknown },
  status = 400,
) {
  return res.status(status).json({
    ok: false,
    error,
  });
}
