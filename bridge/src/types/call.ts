export interface CallRequestInput {
  sessionId: string;
  toolName: string;
  args: Record<string, unknown>;
  timeoutMs?: number;
  requestId?: string;
}

export interface CallSuccessData {
  requestId: string;
  ok: true;
  result: Record<string, unknown>;
  durationMs: number;
}
