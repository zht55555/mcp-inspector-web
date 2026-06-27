"use client";

import { useMemo } from "react";
import { BridgeClientError, startSession, stopSession } from "@/lib/bridgeClient";
import { useI18n } from "@/i18n/I18nProvider";
import { useMcpStore } from "@/stores/useMcpStore";

export function ConnectionPanel() {
  const { t } = useI18n();

  const command = useMcpStore((state) => state.command);
  const sessionId = useMcpStore((state) => state.sessionId);
  const connectionStatus = useMcpStore((state) => state.connectionStatus);
  const setCommand = useMcpStore((state) => state.setCommand);
  const setConnecting = useMcpStore((state) => state.setConnecting);
  const setConnected = useMcpStore((state) => state.setConnected);
  const setError = useMcpStore((state) => state.setError);
  const resetSession = useMcpStore((state) => state.resetSession);

  const connectDisabled = !command.trim() || connectionStatus === "connecting";
  const disconnectDisabled = connectionStatus !== "connected";

  const errorCodeMessages = useMemo(
    () => ({
      E_CMD_EMPTY: t("error.E_CMD_EMPTY"),
      E_SESSION_NOT_FOUND: t("error.E_SESSION_NOT_FOUND"),
      E_BAD_REQUEST: t("error.E_BAD_REQUEST"),
      E_INTERNAL: t("error.E_INTERNAL"),
      E_UNKNOWN: t("error.E_UNKNOWN"),
    }),
    [t],
  );

  const toReadableError = (error: unknown) => {
    if (error instanceof BridgeClientError) {
      const localized =
        errorCodeMessages[error.code as keyof typeof errorCodeMessages] ?? error.message ?? t("error.E_UNKNOWN");
      return `${error.code}: ${localized}`;
    }
    return `E_UNKNOWN: ${t("error.E_UNKNOWN")}`;
  };

  const handleConnect = async () => {
    if (connectDisabled) {
      return;
    }

    setConnecting(t("store.log.connecting"));

    try {
      const data = await startSession({ command: command.trim() });
      setConnected(data.sessionId, t("store.log.connected"));
    } catch (error) {
      setError(toReadableError(error));
    }
  };

  const handleDisconnect = async () => {
    if (!sessionId) {
      setError(`E_SESSION_NOT_FOUND: ${t("error.E_SESSION_NOT_FOUND")}`);
      return;
    }

    try {
      await stopSession({ sessionId });
      resetSession(t("store.log.disconnected"));
    } catch (error) {
      setError(toReadableError(error));
    }
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <h2 className="text-lg font-semibold text-slate-900">{t("connection.title")}</h2>
      <p className="mt-1 text-sm text-slate-600">{t("connection.description")}</p>

      <div className="mt-4 space-y-3">
        <label htmlFor="command" className="block text-sm font-medium text-slate-700">
          {t("connection.commandLabel")}
        </label>
        <input
          id="command"
          type="text"
          value={command}
          onChange={(event) => setCommand(event.target.value)}
          placeholder={t("connection.commandPlaceholder")}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleConnect}
          disabled={connectDisabled}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition enabled:hover:bg-sky-700 disabled:cursor-not-allowed disabled:bg-slate-300"
        >
          {connectionStatus === "connecting" ? t("connection.connecting") : t("connection.connect")}
        </button>
        <button
          type="button"
          onClick={handleDisconnect}
          disabled={disconnectDisabled}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition enabled:hover:border-slate-500 enabled:hover:text-slate-900 disabled:cursor-not-allowed disabled:border-slate-200 disabled:text-slate-400"
        >
          {t("connection.disconnect")}
        </button>
      </div>
    </section>
  );
}
