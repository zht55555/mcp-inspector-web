import type { FormValueMap, ParsedField } from "@/types/schema";

function isEmptyValue(value: FormValueMap[string] | undefined) {
  return value === undefined || value === "";
}

export function buildArgsFromForm(fields: ParsedField[], values: FormValueMap) {
  return fields.reduce<Record<string, unknown>>((result, field) => {
    const value = values[field.key];

    if (isEmptyValue(value)) {
      return result;
    }

    if (field.type === "number") {
      result[field.key] = Number(value);
      return result;
    }

    if (field.type === "boolean") {
      result[field.key] = Boolean(value);
      return result;
    }

    if (field.type === "object" || field.type === "array" || field.type === "json") {
      result[field.key] = JSON.parse(String(value));
      return result;
    }

    result[field.key] = value;
    return result;
  }, {});
}
