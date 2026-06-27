"use client";

import { useEffect, useMemo, useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { subscribeToEvents } from "@/lib/eventStream";
import { useMcpStore } from "@/stores/useMcpStore";

export function LogPanel() {
  const { t } = useI18n();
  const [requestIdKeyword, setRequestIdKeyword] = useState("");
  const logs = useMcpStore((state) => state.logs);
  const sessionId = useMcpStore((state) => state.sessionId);
  const streamConnected = useMcpStore((state) => state.streamConnected);
  const appendStreamLog = useMcpStore((state) => state.appendStreamLog);
  const setStreamConnected = useMcpStore((state) => state.setStreamConnected);

  useEffect(() => {
    if (!sessionId) {
      setStreamConnected(false);
      return;
    }

    const unsubscribe = subscribeToEvents(
      sessionId,
      (event) => {
        if (event.type === "heartbeat") {
          return;
        }

        appendStreamLog({
          timestamp: event.timestamp,
          level: event.level,
          message: event.message,
          requestId: event.requestId,
        });
      },
      (connected) => {
        setStreamConnected(connected);
      },
    );

    return () => {
      unsubscribe();
      setStreamConnected(false);
    };
  }, [appendStreamLog, sessionId, setStreamConnected]);

  const sortedLogs = useMemo(() => {
    const filtered = requestIdKeyword.trim()
      ? logs.filter((log) => (log.requestId ?? "").toLowerCase().includes(requestIdKeyword.trim().toLowerCase()))
      : logs;

    return [...filtered].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [logs, requestIdKeyword]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{t("logs.title")}</h2>
        <div className="flex items-center gap-2">
          <span className={`rounded-full px-2.5 py-1 text-xs font-medium ${streamConnected ? "bg-emerald-100 text-emerald-800" : "bg-amber-100 text-amber-800"}`}>
            {streamConnected ? t("stream.connected") : t("stream.disconnected")}
          </span>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {logs.length}
          </span>
        </div>
      </div>

      <input
        type="text"
        value={requestIdKeyword}
        onChange={(event) => setRequestIdKeyword(event.target.value)}
        placeholder={t("logs.filterPlaceholder")}
        className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
      />

      {sortedLogs.length === 0 ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {t("logs.empty")}
        </p>
      ) : (
        <ul className="mt-4 max-h-[420px] space-y-2 overflow-auto pr-1">
          {sortedLogs.map((log) => (
            <li key={log.id} className="rounded-xl border border-slate-200 p-3">
              <div className="flex items-center justify-between gap-3">
                <span
                  className={`rounded-full px-2 py-0.5 text-xs font-semibold uppercase ${
                    log.level === "error"
                      ? "bg-rose-100 text-rose-800"
                      : "bg-sky-100 text-sky-800"
                  }`}
                >
                  {t(`logs.level.${log.level}`)}
                </span>
                <time className="text-xs text-slate-500">{new Date(log.timestamp).toLocaleTimeString()}</time>
              </div>
              {log.requestId ? <p className="mt-2 text-xs text-slate-500">requestId: {log.requestId}</p> : null}
              <p className="mt-2 text-sm text-slate-700">{log.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
