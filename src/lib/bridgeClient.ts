export interface BridgeErrorPayload {
  code: string;
  message: string;
  details?: unknown;
}

export class BridgeClientError extends Error {
  code: string;
  details?: unknown;

  constructor(payload: BridgeErrorPayload) {
    super(payload.message);
    this.name = "BridgeClientError";
    this.code = payload.code;
    this.details = payload.details;
  }
}

interface StartSessionRequest {
  command: string;
}

interface StartSessionResponse {
  sessionId: string;
  status: "connected";
}

interface StopSessionRequest {
  sessionId: string;
}

interface StopSessionResponse {
  status: "stopped";
}

export interface ToolItem {
  name: string;
  description: string;
  inputSchema: Record<string, unknown>;
}

interface GetToolsResponse {
  tools: ToolItem[];
}

const BRIDGE_BASE_URL = process.env.NEXT_PUBLIC_BRIDGE_URL ?? "http://localhost:3001";

async function bridgeRequest<T>(path: string, init: RequestInit): Promise<T> {
  const response = await fetch(`${BRIDGE_BASE_URL}${path}`, {
    ...init,
    headers: {
      "Content-Type": "application/json",
      ...(init.headers ?? {}),
    },
  });

  const payload = await response.json();

  if (!response.ok || !payload.ok) {
    const errorPayload: BridgeErrorPayload = payload.error ?? {
      code: "E_UNKNOWN",
      message: "Unexpected bridge error.",
    };
    throw new BridgeClientError(errorPayload);
  }

  return payload.data as T;
}

export async function startSession(input: StartSessionRequest): Promise<StartSessionResponse> {
  return bridgeRequest<StartSessionResponse>("/api/session/start", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function stopSession(input: StopSessionRequest): Promise<StopSessionResponse> {
  return bridgeRequest<StopSessionResponse>("/api/session/stop", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export async function getTools(sessionId: string): Promise<GetToolsResponse> {
  const search = new URLSearchParams({ sessionId });
  return bridgeRequest<GetToolsResponse>(`/api/tools?${search.toString()}`, {
    method: "GET",
  });
}
