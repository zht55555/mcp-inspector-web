"use client";

import { useMemo, useState } from "react";
import { ParamFormRenderer } from "@/components/ParamFormRenderer";
import { ResultInspector } from "@/components/ResultInspector";
import { useI18n } from "@/i18n/I18nProvider";
import { useMcpStore } from "@/stores/useMcpStore";

export function ToolsCatalog() {
  const { t } = useI18n();
  const [keyword, setKeyword] = useState("");

  const tools = useMcpStore((state) => state.tools);
  const toolsLoading = useMcpStore((state) => state.toolsLoading);
  const toolsError = useMcpStore((state) => state.toolsError);
  const selectedTool = useMcpStore((state) => state.selectedTool);
  const sessionId = useMcpStore((state) => state.sessionId);
  const fetchTools = useMcpStore((state) => state.fetchTools);
  const setSelectedTool = useMcpStore((state) => state.setSelectedTool);

  const toolsErrorMessages = useMemo(
    () => ({
      E_NOT_CONNECTED: t("error.E_NOT_CONNECTED"),
      E_LIST_TOOLS_FAIL: t("error.E_LIST_TOOLS_FAIL"),
      E_UNKNOWN: t("error.E_UNKNOWN"),
    }),
    [t],
  );

  const filteredTools = useMemo(() => {
    const q = keyword.trim().toLowerCase();
    if (!q) {
      return tools;
    }
    return tools.filter((tool) => {
      return tool.name.toLowerCase().includes(q) || tool.description.toLowerCase().includes(q);
    });
  }, [keyword, tools]);

  const toolErrorMessage = toolsError
    ? toolsErrorMessages[toolsError as keyof typeof toolsErrorMessages] ?? t("error.E_UNKNOWN")
    : null;

  const onRetry = async () => {
    if (!sessionId) {
      return;
    }
    await fetchTools(sessionId);
  };

  return (
    <div className="space-y-4">
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold text-slate-900">{t("tools.title")}</h2>
          <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">
            {tools.length}
          </span>
        </div>

        <input
          type="text"
          value={keyword}
          onChange={(event) => setKeyword(event.target.value)}
          placeholder={t("tools.searchPlaceholder")}
          className="mt-3 w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />

        {toolsLoading ? (
          <p className="mt-4 text-sm text-slate-600">{t("tools.loading")}</p>
        ) : null}

        {!toolsLoading && toolErrorMessage ? (
          <div className="mt-4 rounded-xl border border-rose-200 bg-rose-50 p-3 text-sm text-rose-800">
            <p>{toolErrorMessage}</p>
            <button
              type="button"
              onClick={onRetry}
              disabled={!sessionId}
              className="mt-2 rounded-lg border border-rose-300 px-3 py-1 text-xs font-medium transition enabled:hover:bg-rose-100 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {t("tools.retry")}
            </button>
          </div>
        ) : null}

        {!toolsLoading && !toolErrorMessage && filteredTools.length === 0 ? (
          <p className="mt-4 rounded-xl border border-dashed border-slate-300 bg-slate-50 p-4 text-sm text-slate-600">
            {t("tools.empty")}
          </p>
        ) : null}

        {!toolsLoading && !toolErrorMessage && filteredTools.length > 0 ? (
          <ul className="mt-4 space-y-2">
            {filteredTools.map((tool) => {
              const schemaFieldCount =
                typeof tool.inputSchema === "object" && tool.inputSchema && "properties" in tool.inputSchema
                  ? Object.keys((tool.inputSchema as { properties?: Record<string, unknown> }).properties ?? {}).length
                  : 0;

              const isActive = selectedTool?.name === tool.name;

              return (
                <li key={tool.name}>
                  <button
                    type="button"
                    onClick={() => setSelectedTool(tool)}
                    className={`w-full rounded-xl border p-3 text-left transition ${
                      isActive
                        ? "border-sky-400 bg-sky-50"
                        : "border-slate-200 hover:border-slate-300"
                    }`}
                  >
                    <h3 className="text-sm font-semibold text-slate-900">{tool.name}</h3>
                    <p className="mt-1 text-sm text-slate-600">{tool.description}</p>
                    <p className="mt-2 text-xs text-slate-500">
                      {t("tools.schemaFields")}: {schemaFieldCount}
                    </p>
                  </button>
                </li>
              );
            })}
          </ul>
        ) : null}
      </section>

      <ParamFormRenderer tool={selectedTool} />
      <ResultInspector />
    </div>
  );
}
