"use client";

import { useState } from "react";
import { useI18n } from "@/i18n/I18nProvider";
import { useMcpStore } from "@/stores/useMcpStore";

export function ResultInspector() {
  const { t } = useI18n();
  const [copied, setCopied] = useState(false);
  const resultState = useMcpStore((state) => state.lastExecution);

  const handleCopy = async () => {
    if (!resultState) {
      return;
    }
    await navigator.clipboard.writeText(JSON.stringify(resultState, null, 2));
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{t("result.title")}</h2>
        <button
          type="button"
          onClick={handleCopy}
          disabled={!resultState}
          className="rounded-xl border border-slate-300 px-3 py-1.5 text-xs font-medium text-slate-700 transition enabled:hover:border-slate-500 enabled:hover:text-slate-900 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {copied ? t("result.copied") : t("result.copy")}
        </button>
      </div>

      {!resultState ? (
        <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
          {t("result.empty")}
        </p>
      ) : (
        <div className="mt-4 space-y-3">
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{t("result.requestId")}</p>
              <p className="mt-1 break-all text-sm font-medium text-slate-900">{resultState.requestId}</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{t("result.duration")}</p>
              <p className="mt-1 text-sm font-medium text-slate-900">{resultState.durationMs} ms</p>
            </div>
            <div className="rounded-xl bg-slate-50 p-3">
              <p className="text-xs text-slate-500">{t("result.status")}</p>
              <p className={`mt-1 text-sm font-medium ${resultState.ok ? "text-emerald-700" : "text-rose-700"}`}>
                {resultState.ok ? t("result.success") : t("result.failed")}
              </p>
            </div>
          </div>

          {resultState.errorCode ? (
            <p className="text-sm text-rose-700">
              {resultState.errorCode}: {resultState.errorMessage}
            </p>
          ) : null}

          <pre className="overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">
            {JSON.stringify(resultState.ok ? resultState.result : resultState.error, null, 2)}
          </pre>
        </div>
      )}
    </section>
  );
}
