"use client";

import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/i18n/I18nProvider";
import { useMcpStore } from "@/stores/useMcpStore";

const statusStyles: Record<string, string> = {
  idle: "bg-slate-100 text-slate-700",
  connecting: "bg-amber-100 text-amber-800",
  connected: "bg-emerald-100 text-emerald-800",
  error: "bg-rose-100 text-rose-800",
};

export function StatusBar() {
  const { t } = useI18n();
  const connectionStatus = useMcpStore((state) => state.connectionStatus);
  const sessionId = useMcpStore((state) => state.sessionId);

  return (
    <header className="sticky top-0 z-10 rounded-2xl border border-slate-200 bg-white/90 p-4 shadow-sm backdrop-blur">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-base font-semibold text-slate-900 sm:text-lg">{t("app.title")}</h1>
        <div className="flex flex-wrap items-center justify-end gap-3 text-sm">
          <LanguageSwitcher />
          <div className="flex items-center gap-2">
            <span className="text-slate-500">{t("status.label")}</span>
            <span className={`rounded-full px-3 py-1 font-medium ${statusStyles[connectionStatus]}`}>
              {t(`status.${connectionStatus}`)}
            </span>
          </div>
        </div>
      </div>
      <p className="mt-2 text-sm text-slate-600">
        {t("status.session")}: <span className="font-mono text-slate-800">{sessionId ?? t("common.na")}</span>
      </p>
    </header>
  );
}
