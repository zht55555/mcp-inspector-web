export const ErrorCodes = {
  CMD_EMPTY: "E_CMD_EMPTY",
  SESSION_NOT_FOUND: "E_SESSION_NOT_FOUND",
  BAD_REQUEST: "E_BAD_REQUEST",
  INTERNAL: "E_INTERNAL",
} as const;

export type ErrorCode = (typeof ErrorCodes)[keyof typeof ErrorCodes];

export class AppError extends Error {
  code: ErrorCode;
  status: number;
  details?: unknown;

  constructor(code: ErrorCode, message: string, status = 400, details?: unknown) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.status = status;
    this.details = details;
  }
}
