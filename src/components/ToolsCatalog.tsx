"use client";

import { useI18n } from "@/i18n/I18nProvider";

export function ToolsCatalog() {
  const { t } = useI18n();

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{t("tools.title")}</h2>
      <p className="mt-2 text-sm text-slate-600">{t("tools.placeholder")}</p>
    </section>
  );
}
