"use client";

import { useMemo } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useMcpStore } from "@/stores/useMcpStore";

export function LogPanel() {
  const { t } = useI18n();
  const logs = useMcpStore((state) => state.logs);

  const sortedLogs = useMemo(() => {
    return [...logs].sort((a, b) => (a.timestamp < b.timestamp ? 1 : -1));
  }, [logs]);

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-slate-900">{t("logs.title")}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
          {logs.length}
        </span>
      </div>

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
              <p className="mt-2 text-sm text-slate-700">{log.message}</p>
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
