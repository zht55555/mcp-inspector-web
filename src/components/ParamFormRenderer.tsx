"use client";

import { useEffect, useMemo, useState } from "react";
import { buildArgsFromForm } from "@/lib/buildArgs";
import { parseSchemaToFields } from "@/lib/schemaParser";
import { validateFormValues } from "@/lib/validateArgs";
import { useI18n } from "@/i18n/I18nProvider";
import type { UiTool } from "@/types/mcp";
import type { FormErrorMap, FormValueMap, ParsedField } from "@/types/schema";

interface ParamFormRendererProps {
  tool: UiTool | null;
}

function FieldInput({ field, value, onChange }: { field: ParsedField; value: FormValueMap[string] | undefined; onChange: (nextValue: string | boolean) => void; }) {
  switch (field.type) {
    case "boolean":
      return (
        <label className="flex items-center gap-2 text-sm text-slate-700">
          <input
            type="checkbox"
            checked={Boolean(value)}
            onChange={(event) => onChange(event.target.checked)}
          />
          <span>{field.label}</span>
        </label>
      );
    case "enum":
      return (
        <select
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        >
          <option value=""></option>
          {(field.options ?? []).map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </select>
      );
    case "object":
    case "array":
    case "json":
      return (
        <textarea
          value={typeof value === "string" ? value : ""}
          onChange={(event) => onChange(event.target.value)}
          rows={5}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm font-mono text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      );
    default:
      return (
        <input
          type={field.type === "number" ? "number" : "text"}
          value={typeof value === "string" || typeof value === "number" ? String(value) : ""}
          onChange={(event) => onChange(event.target.value)}
          className="w-full rounded-xl border border-slate-300 px-3 py-2 text-sm text-slate-900 outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-100"
        />
      );
  }
}

export function ParamFormRenderer({ tool }: ParamFormRendererProps) {
  const { t } = useI18n();
  const [values, setValues] = useState<FormValueMap>({});
  const [errors, setErrors] = useState<FormErrorMap>({});
  const [copied, setCopied] = useState(false);

  const fields = useMemo(() => {
    return tool ? parseSchemaToFields(tool.inputSchema) : [];
  }, [tool]);

  useEffect(() => {
    setValues({});
    setErrors({});
    setCopied(false);
  }, [tool]);

  const argsPreview = useMemo(() => {
    try {
      return JSON.stringify(buildArgsFromForm(fields, values), null, 2);
    } catch {
      return "{}";
    }
  }, [fields, values]);

  if (!tool) {
    return (
      <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <h2 className="text-lg font-semibold text-slate-900">{t("form.title")}</h2>
        <p className="mt-2 text-sm text-slate-600">{t("form.empty")}</p>
      </section>
    );
  }

  const handleChange = (key: string, nextValue: string | boolean) => {
    setValues((current) => ({
      ...current,
      [key]: nextValue,
    }));
  };

  const handleValidate = () => {
    const nextErrors = validateFormValues(fields, values);
    setErrors(nextErrors);
  };

  const handleCopy = async () => {
    await navigator.clipboard.writeText(argsPreview);
    setCopied(true);
    window.setTimeout(() => setCopied(false), 1200);
  };

  return (
    <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between gap-3">
        <h2 className="text-lg font-semibold text-slate-900">{t("form.title")}</h2>
        <span className="rounded-full bg-slate-100 px-2.5 py-1 text-xs font-medium text-slate-600">{tool.name}</span>
      </div>

      <div className="mt-4 space-y-4">
        {fields.map((field) => (
          <div key={field.key} className="space-y-2">
            <div className="flex items-center gap-2">
              <label className="text-sm font-medium text-slate-800">{field.label}</label>
              {field.rules.required ? (
                <span className="rounded bg-rose-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-rose-700">
                  {t("form.required")}
                </span>
              ) : null}
            </div>
            {field.description ? <p className="text-xs text-slate-500">{field.description}</p> : null}
            <FieldInput field={field} value={values[field.key]} onChange={(nextValue) => handleChange(field.key, nextValue)} />
            {errors[field.key] ? <p className="text-xs text-rose-700">{t(errors[field.key] as never)}</p> : null}
          </div>
        ))}
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={handleValidate}
          className="rounded-xl bg-sky-600 px-4 py-2 text-sm font-medium text-white transition hover:bg-sky-700"
        >
          {t("form.validate")}
        </button>
        <button
          type="button"
          onClick={handleCopy}
          className="rounded-xl border border-slate-300 px-4 py-2 text-sm font-medium text-slate-700 transition hover:border-slate-500 hover:text-slate-900"
        >
          {copied ? t("form.copied") : t("form.copy")}
        </button>
      </div>

      <div className="mt-5">
        <h3 className="text-sm font-semibold text-slate-900">{t("form.previewTitle")}</h3>
        <pre className="mt-2 overflow-auto rounded-xl bg-slate-950 p-4 text-xs text-slate-100">{argsPreview}</pre>
      </div>
    </section>
  );
}
