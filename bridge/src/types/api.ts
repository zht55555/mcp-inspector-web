export interface ApiError {
  code: string;
  message: string;
  details?: unknown;
}

export interface ApiSuccess<T> {
  ok: true;
  data: T;
}

export interface ApiFailure {
  ok: false;
  error: ApiError;
}

export type ApiResponse<T> = ApiSuccess<T> | ApiFailure;

export interface SessionInfo {
  sessionId: string;
  status: "connected";
  command: string;
  startedAt: string;
}

export interface StartSessionData {
  sessionId: string;
  status: "connected";
}

export interface StopSessionData {
  status: "stopped";
}
